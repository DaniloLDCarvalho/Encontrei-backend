from sentence_transformers import SentenceTransformer
import numpy as np
import re
import json
import sys

CATEGORY_SYNONYMS = {
    "vestido": ["vestido", "vestidinho", "vestidão"],
    "blusa": ["blusa", "blusinha", "cropped", "camiseta", "camisa feminina"],
    "calça": ["calca", "calça", "jeans", "pantacourt", "legging", "flare", "cargo"],
    "saia": ["saia", "sainha"],
    "tênis": ["tenis", "tênis"],
    "sandália": ["sandalia", "sandália", "salto", "rasteira"],
    "bolsa": ["bolsa"],
    "short": ["short", "shorts", "short saia"],
    "jaqueta": ["jaqueta", "casaco"],
    "moletom": ["moletom", "hoodie"],
    "cardigan": ["cardigan", "cardigã"],
    "macacão": ["macacao", "macacão"],
    "top": ["top", "tomara que caia", "faixa"],
}

COLOR_SYNONYMS = {
    "preto": ["preto", "preta", "pretinho"],
    "branco": ["branco", "branca", "branquinho"],
    "azul": ["azul", "azul marinho", "azul claro", "azul escuro"],
    "rosa": ["rosa", "rosinha", "pink"],
    "vermelho": ["vermelho", "vermelha", "vinho", "bordô", "bordeaux"],
    "verde": ["verde", "verde oliva", "militar"],
    "bege": ["bege", "nude"],
    "amarelo": ["amarelo", "amarela", "mostarda"],
    "cinza": ["cinza", "mescla", "chumbo"],
    "floral": ["florido", "floral", "estampa de flores"],
    "jeans": ["jeans", "denim"],
}

RE_TAM_LETRA = re.compile(r"\b(PP|P|M|G|GG|XG|XGG)\b", re.IGNORECASE)
RE_TAM_NUM = re.compile(r"\b(3[4-9]|4[0-4])\b")

model = SentenceTransformer("paraphrase-multilingual-mpnet-base-v2")

def extract_filters(query: str):
    q = query.lower()
    categoria = None
    cor = None
    tamanho = None

    for cat, words in CATEGORY_SYNONYMS.items():
        if any(w in q for w in words):
            categoria = cat
            break

    for base_color, words in COLOR_SYNONYMS.items():
        if any(w in q for w in words):
            cor = base_color
            break

    m = RE_TAM_LETRA.search(query)
    if m:
        tamanho = m.group(1).upper()
    else:
        m_num = RE_TAM_NUM.search(q)
        if m_num:
            tamanho = m_num.group(1)

    return categoria, cor, tamanho


def filtrar_indices(produtos, categoria, cor, tamanho):
    indices_pontuados = []
    for i, p in enumerate(produtos):
        score = 0

        if categoria is not None:
            if p["categoria"].lower() != categoria.lower():
                continue
            else:
                score += 3

        if cor is not None:
            if cor.lower() in p["cor"].lower():
                score += 1

        if tamanho is not None:
            if tamanho.upper() in [t.upper() for t in p["tamanhos"]]:
                score += 2

        indices_pontuados.append((i, score))

    indices_ordenados = sorted(indices_pontuados, key=lambda x: x[1], reverse=True)
    return indices_ordenados


def buscar(query: str, produtos, emb_produtos, categoria: str, cor: str, tamanho: str, top_k: int):
    idx_filtrados_ordenados = filtrar_indices(produtos=produtos, categoria=categoria, cor=cor, tamanho=tamanho)

    if len(idx_filtrados_ordenados) == 0:
        return []

    manual_scores = {idx: score for idx, score in idx_filtrados_ordenados}

    emb_query = model.encode([query], normalize_embeddings=True).astype("float32")
    scores_modelo = np.dot(emb_produtos, emb_query[0])

    indices = range(len(produtos))

    ranking = sorted(
        indices,
        key=lambda idx: (
            manual_scores.get(idx, 0),
            scores_modelo[idx],
        ),
        reverse=True,
    )

    resultados = []
    for idx in ranking[:top_k]:
        p = produtos[idx]
        resultados.append(
            {
                "produto_id": p["id"],
                "categoria": p["categoria"],
                "cor": p["cor"],
                "tamanhos": p["tamanhos"],
                "texto": p["texto"],
                "score_modelo": float(scores_modelo[idx]),
                "score_manual": float(manual_scores.get(idx, 0)),
            }
        )

    return resultados


def main():
    # Lê JSON vindo do Node via stdin
    raw = sys.stdin.read()
    if not raw:
        print(json.dumps({"error": "no input"}))
        return

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": "invalid JSON input", "details": str(e)}))
        return

    query = data.get("query", "")
    produtos = data.get("produtos", [])

    texts = [p["texto"] for p in produtos]
    emb_produtos = model.encode(texts, normalize_embeddings=True)
    emb_produtos = np.array(emb_produtos).astype("float32")

    if not query or not produtos:
        print(json.dumps({"error": "missing query or produtos"}))
        return

    categoria, cor, tamanho = extract_filters(query)
    resultados = buscar(query, produtos, emb_produtos, categoria, cor, tamanho, top_k=40)
    print(json.dumps(resultados, ensure_ascii=False))


if __name__ == "__main__":
    main()
    # query = "calça preta tamanho p"
    # categoria, cor, tamanho = extract_filters(query)
    # resultado = buscar(query, categoria, cor, tamanho, top_k=40)
    # df = pd.DataFrame(resultado)
    # df.to_csv("resultados_busca.csv", index=False)
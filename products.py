from sentence_transformers import SentenceTransformer
import numpy as np
import re
import pandas as pd

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
RE_TAM_NUM = re.compile(r"\b(3[4-9]|4[0-4])\b")  # calçados 34-44, ajuste se quiser

# 1. Carregar modelo multilíngue (melhor pra PT-BR)
model = SentenceTransformer("paraphrase-multilingual-mpnet-base-v2")

# 2. Catálogo de produtos (categoria/cor/tamanho)
produtos = [
    {"id": 1, "categoria": "vestido", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Vestido midi preto, alça fina, tecido leve, festa casual, cor preta, tamanhos P, M e G"},

    {"id": 2, "categoria": "calça", "cor": "azul clara", "tamanhos": ["36","38","40"],
     "texto": "Calça jeans mom feminina azul clara, cintura alta, rasgos no joelho, cor azul clara, tamanhos 36, 38 e 40"},

    {"id": 3, "categoria": "blusa", "cor": "branca", "tamanhos": ["P","M","G"],
     "texto": "Blusa cropped branca de algodão, manga curta, moda feminina, cor branca, tamanhos P, M e G"},

    {"id": 4, "categoria": "camisa", "cor": "azul clara", "tamanhos": ["P","M","G"],
     "texto": "Camisa social feminina azul clara, manga longa, corte slim, tamanhos P, M e G"},

    {"id": 5, "categoria": "saia", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Saia lápis preta, tecido encorpado, ideal para trabalho, cor preta, tamanhos P, M e G"},

    {"id": 6, "categoria": "short", "cor": "azul jeans", "tamanhos": ["36","38","40","42"],
     "texto": "Short jeans feminino cintura alta, lavagem média, cor azul jeans, tamanhos 36, 38, 40 e 42"},

    {"id": 7, "categoria": "jaqueta", "cor": "azul escuro", "tamanhos": ["P","M","G"],
     "texto": "Jaqueta jeans feminina oversized, azul escuro, estilo casual, tamanhos P, M e G"},

    {"id": 8, "categoria": "regata", "cor": "cinza", "tamanhos": ["P","M","G"],
     "texto": "Blusa regata feminina cinza mescla de algodão, cor cinza, tamanhos P, M e G"},

    {"id": 9, "categoria": "vestido", "cor": "floral rosa", "tamanhos": ["P","M","G"],
     "texto": "Vestido longo floral feminino, alças finas, estilo romântico, cor floral rosa, tamanhos P, M e G"},

    {"id": 10, "categoria": "tênis", "cor": "branco", "tamanhos": ["34","35","36","37","38","39"],
     "texto": "Tênis casual feminino branco, couro sintético, sola alta, numeração 34 ao 39"},

    {"id": 11, "categoria": "calça", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Calça jogger feminina preta, tecido moletom, punho na barra, cor preta, tamanhos P, M e G"},

    {"id": 12, "categoria": "blusa", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Cropped preto de manga longa, tecido canelado, moda feminina, tamanhos P, M e G"},

    {"id": 13, "categoria": "blusa", "cor": "rosa clara", "tamanhos": ["P","M","G"],
     "texto": "Blusa feminina de algodão, gola redonda, cor rosa clara, tamanhos P, M e G"},

    {"id": 14, "categoria": "macacão", "cor": "terracota", "tamanhos": ["P","M","G"],
     "texto": "Macacão pantacourt feminino, cor terracota, alças largas, tamanhos P, M e G"},

    {"id": 15, "categoria": "blazer", "cor": "bege", "tamanhos": ["P","M","G"],
     "texto": "Blazer feminino bege, corte reto, elegante para trabalho, tamanhos P, M e G"},

    {"id": 16, "categoria": "top", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Top fitness feminino preto, alto suporte, tecido dry fit, tamanhos P, M e G"},

    {"id": 17, "categoria": "legging", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Legging feminina preta de compressão, ideal para academia, cintura alta, tamanhos P, M e G"},

    {"id": 18, "categoria": "blusa", "cor": "bege", "tamanhos": ["P","M","G"],
     "texto": "Blusa de tricô feminina bege, gola alta, ideal para inverno, tamanhos P, M e G"},

    {"id": 19, "categoria": "calça", "cor": "preto", "tamanhos": ["36","38","40","42"],
     "texto": "Calça feminina de alfaiataria preta, corte reto, tamanhos 36, 38, 40 e 42"},

    {"id": 20, "categoria": "sandália", "cor": "dourado", "tamanhos": ["34","35","36","37","38","39"],
     "texto": "Sandália rasteira feminina dourada, tiras finas, numeração 34 ao 39"},

    {"id": 21, "categoria": "sandália", "cor": "preto", "tamanhos": ["34","35","36","37","38","39"],
     "texto": "Sandália de salto alto feminina preta, tiras cruzadas, numeração 34 ao 39"},

    {"id": 22, "categoria": "bolsa", "cor": "preto", "tamanhos": ["único"],
     "texto": "Bolsa transversal feminina preta, couro sintético, ideal para uso diário"},

    {"id": 23, "categoria": "chinelo", "cor": "preto", "tamanhos": ["34","35","36","37","38","39"],
     "texto": "Chinelo slide feminino preto, borracha macia, numeração 34 ao 39"},

    {"id": 24, "categoria": "vestido", "cor": "vermelho", "tamanhos": ["P","M","G"],
     "texto": "Vestido tubinho vermelho feminino, elegante, ideal para festas, tamanhos P, M e G"},

    {"id": 25, "categoria": "vestido", "cor": "jeans", "tamanhos": ["P","M","G"],
     "texto": "Vestido curto jeans feminino, manga curta, lavagem média, tamanhos P, M e G"},

    {"id": 26, "categoria": "camiseta", "cor": "branco", "tamanhos": ["P","M","G"],
     "texto": "Camiseta feminina branca básica, 100% algodão, tamanhos P, M e G"},

    {"id": 27, "categoria": "jaqueta", "cor": "azul marinho", "tamanhos": ["P","M","G"],
     "texto": "Jaqueta corta-vento feminina azul marinho, com capuz, tamanhos P, M e G"},

    {"id": 28, "categoria": "moletom", "cor": "rosa", "tamanhos": ["P","M","G"],
     "texto": "Moletom feminino rosa oversized, sem estampa, tamanhos P, M e G"},

    {"id": 29, "categoria": "saia", "cor": "bege", "tamanhos": ["P","M","G"],
     "texto": "Saia plissada feminina bege, comprimento midi, tamanhos P, M e G"},

    {"id": 30, "categoria": "top", "cor": "branco", "tamanhos": ["P","M","G"],
     "texto": "Top faixa feminino branco, ideal para verão, tamanhos P, M e G"},

    {"id": 31, "categoria": "calça", "cor": "preto", "tamanhos": ["36","38","40","42"],
     "texto": "Calça flare feminina preta, tecido encorpado, tamanhos 36, 38, 40 e 42"},

    {"id": 32, "categoria": "vestido", "cor": "listrado azul", "tamanhos": ["P","M","G"],
     "texto": "Vestido curto listrado feminino, manga curta, branco com azul, tamanhos P, M e G"},

    {"id": 33, "categoria": "camiseta", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Camiseta feminina preta oversized, estilo streetwear, tamanhos P, M e G"},

    {"id": 34, "categoria": "calça", "cor": "verde militar", "tamanhos": ["36","38","40"],
     "texto": "Calça cargo feminina verde militar, com bolsos funcionais, tamanhos 36, 38 e 40"},

    {"id": 35, "categoria": "short", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Short saia feminino preto, ideal para academia, tecido dry fit, tamanhos P, M e G"},

    {"id": 36, "categoria": "tênis", "cor": "preto", "tamanhos": ["34","35","36","37","38","39"],
     "texto": "Tênis esportivo feminino preto com detalhes brancos, corrida, numeração 34 ao 39"},

    {"id": 37, "categoria": "blusa", "cor": "rosa", "tamanhos": ["P","M","G"],
     "texto": "Blusa ombro a ombro feminina rosa, tecido leve, tamanhos P, M e G"},

    {"id": 38, "categoria": "cardigan", "cor": "cinza", "tamanhos": ["P","M","G"],
     "texto": "Cardigan longo feminino cinza mescla de tricô, tamanhos P, M e G"},

    {"id": 39, "categoria": "legging", "cor": "azul marinho", "tamanhos": ["P","M","G"],
     "texto": "Legging feminina azul marinho, confortável para o dia a dia, tamanhos P, M e G"},

    {"id": 40, "categoria": "blusa", "cor": "branca", "tamanhos": ["P","M","G"],
     "texto": "Blusa social feminina branca, manga bufante, elegante, tamanhos P, M e G"},

    {"id": 41, "categoria": "blusa", "cor": "colorido", "tamanhos": ["P","M","G"],
     "texto": "Cropped tie-dye feminino colorido, verão, cores azul, rosa e amarelo, tamanhos P, M e G"},

    {"id": 42, "categoria": "camisa", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Camisa feminina preta, casual, manga curta, tamanhos P, M e G"},

    {"id": 43, "categoria": "vestido", "cor": "branco", "tamanhos": ["P","M","G"],
     "texto": "Vestido de renda feminino branco, curto, ideal para festa de dia, tamanhos P, M e G"},

    {"id": 44, "categoria": "moletom", "cor": "preto", "tamanhos": ["P","M","G"],
     "texto": "Moletom feminino preto com capuz, básico e confortável, tamanhos P, M e G"},

    {"id": 45, "categoria": "bolsa", "cor": "nude", "tamanhos": ["único"],
     "texto": "Bolsa de mão feminina nude, elegante, ideal para festas"},

    {"id": 46, "categoria": "top", "cor": "vermelho", "tamanhos": ["P","M","G"],
     "texto": "Top tomara que caia feminino vermelho, ideal para eventos, tamanhos P, M e G"},

    {"id": 47, "categoria": "saia", "cor": "azul clara", "tamanhos": ["34","36","38"],
     "texto": "Saia jeans feminina curta azul clara, estilo verão, tamanhos 34, 36 e 38"},

    {"id": 48, "categoria": "tênis", "cor": "branco", "tamanhos": ["34","35","36","37","38","39"],
     "texto": "Tênis chunky feminino branco, sola grossa, tendência fashion, numeração 34 ao 39"},

    {"id": 49, "categoria": "vestido", "cor": "preto floral", "tamanhos": ["P","M","G"],
     "texto": "Vestido floral feminino midi, fundo preto com flores coloridas, tamanhos P, M e G"},

    {"id": 50, "categoria": "blusa", "cor": "verde oliva", "tamanhos": ["P","M","G"],
     "texto": "Blusa básica feminina verde oliva, gola redonda, tamanhos P, M e G"},
]

# 3. Gerar embeddings só dos textos
texts = [p["texto"] for p in produtos]
emb_produtos = model.encode(texts, normalize_embeddings=True)
emb_produtos = np.array(emb_produtos).astype("float32")


def extract_filters(query: str):
    q = query.lower()
    categoria = None
    cor = None
    tamanho = None

    # 1) Detectar categoria
    for cat, words in CATEGORY_SYNONYMS.items():
        if any(w in q for w in words):
            categoria = cat
            break

    # 2) Detectar cor
    for base_color, words in COLOR_SYNONYMS.items():
        if any(w in q for w in words):
            cor = base_color
            break

    # 3) Detectar tamanho por letra (P, M, G…)
    m = RE_TAM_LETRA.search(query)
    if m:
        tamanho = m.group(1).upper()
    else:
        # 4) Detectar tamanho numérico (36, 38…)
        m_num = RE_TAM_NUM.search(q)
        if m_num:
            tamanho = m_num.group(1)

    return categoria, cor, tamanho


def filtrar_indices(categoria=None, cor=None, tamanho=None):
    """
    Retorna a lista de índices dos produtos que passam nos filtros.
    Se o filtro for None, ignora aquele critério.
    """
    indices_pontuados = []
    for i, p in enumerate(produtos):
        score = 0
        if categoria is not None:
            if p["categoria"].lower() != categoria.lower():
                continue
            else:
                score+=3
            
        # filtro por cor
        if cor is not None:
            if cor.lower() in p["cor"].lower():
                score+=1

        # filtro por tamanho
        if tamanho is not None:
            if tamanho.upper() in [t.upper() for t in p["tamanhos"]]:
                score+=2

        indices_pontuados.append((i,score))

    indices_ordenados = sorted(indices_pontuados, key=lambda x:x[1], reverse=True)
    return indices_ordenados


def buscar(query: str, categoria: str, cor: str, tamanho: str, top_k):
    """
    Busca semântica com filtros:
    - query: texto buscado
    - top_k: quantos resultados retornar
    - categoria: ex. "vestido", "blusa", "calça"
    - cor: ex. "preto", "floral", "branca"
    - tamanho: ex. "P", "M", "G", "38"
    """
    # 1) Filtrar produtos por categoria/cor/tamanho
    idx_filtrados_ordenados = filtrar_indices(categoria=categoria, cor=cor, tamanho=tamanho)

    if len(idx_filtrados_ordenados) == 0:
        print("Nenhum produto encontrado com esses filtros.")
        return []

    manual_scores = {idx: score for idx, score in idx_filtrados_ordenados}

    # 2) Gerar embedding da query
    emb_query = model.encode([query], normalize_embeddings=True).astype("float32")  # shape: (1, d)

    # 4) Similaridade por produto interno (como está normalizado, é cosseno)
    scores_modelo = np.dot(emb_produtos, emb_query[0])

    indices = range((len(produtos)))

    ranking = sorted(
        indices,
        key =lambda idx:(
            manual_scores.get(idx,0),
            scores_modelo[idx],
        ),
        reverse=True
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
                "score": float(scores_modelo[idx]),
            }
        )

    return resultados


if __name__ == "__main__":
    query = "calça preta tamanho p"
    categoria, cor, tamanho = extract_filters(query)
    resultado = buscar(query, categoria, cor, tamanho, top_k=40)

    df = pd.DataFrame(resultado)
    df.to_csv("resultados_busca.csv", index=False)

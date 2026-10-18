#!/usr/bin/env python3
"""Texto por capítulos de 1966: The Year the Decade Exploded (Jon Savage, ePub de Faber & Faber, 2015).

Uso: python3 -I tools/split.py <dir_txt> <dir_salida>

<dir_txt> tiene un .txt por fichero del ePub (pandoc, un párrafo por línea). Capítulo 1: la
introducción; 2-13: los doce meses (chapter_01 … chapter_12, cuya primera línea es «1 : JANUARY»
y la segunda el título); 14: la discografía del libro (glossary), los singles de cada mes, cuyos
encabezados «JANUARY 1966» se guardan como sección. Escribe <dir>/NN.txt y <dir>/book.json
(párrafos {ch, sec, segs:[[pág, texto]]}, el formato de tools/refs.py). El ePub no trae
paginación impresa: la página se estima a 300 palabras por página desde la introducción.
"""
import json
import re
import sys
from pathlib import Path

WORDS_PER_PAGE = 300
FILES = {1: 'introduction'} | {n + 1: f'chapter_{n:02d}' for n in range(1, 13)} | {14: 'glossary'}
PREFIX = '9780571277643_'


def main(txt_dir, out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    paras, words = [], 0
    for ch, name in FILES.items():
        lines = [l.strip() for l in (Path(txt_dir) / f'{PREFIX}{name}.txt').read_text().splitlines()]
        lines = [l for l in lines if l and l != '[]']
        sec, text = None, []
        for i, l in enumerate(lines):
            if i == 0 or (1 < ch < 14 and i == 1) or (ch == 14 and re.fullmatch(r'[A-Z]+ 1966', l)):
                sec = l if ch == 14 and i else None
                text.append(f'## {l}')
                continue
            page = words // WORDS_PER_PAGE + 1
            paras.append({'ch': ch, 'sec': sec, 'segs': [[page, l]]})
            text.append(f'[pág. ≈{page}] {l}')
            words += len(l.split())
        (out / f'{ch:02d}.txt').write_text('\n\n'.join(text) + '\n')
        print(f'cap. {ch}: {sum(len(p["segs"][0][1].split()) for p in paras if p["ch"] == ch)} palabras')
    (out / 'book.json').write_text(json.dumps(paras, ensure_ascii=False))


if __name__ == '__main__':
    main(*sys.argv[1:])

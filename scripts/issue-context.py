#!/usr/bin/env python3
"""
Genera un título tipo "<Tipo>: <Resumen>" y lista de archivos cambiados vs base (por defecto master).
Uso:
  ./scripts/issue-context.py Mejora "Prompt para crear un issue"
  ./scripts/issue-context.py Mejora           # usa el último commit subject como resumen
Opciones:
  --base BRANCH  rama base para diff (default: master)
"""
from __future__ import annotations
import argparse
import subprocess
import sys

def run(cmd: list[str]) -> str:
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip() or "git command failed")
    return res.stdout.strip()

def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("type", help="Tipo de issue (Mejora, Bug, etc.)")
    p.add_argument("summary", nargs="?", help="Resumen corto. Si se omite, se usa el último commit subject")
    p.add_argument("--base", default="master", help="Rama base para comparar (default: master)")
    args = p.parse_args()

    summary = args.summary
    if not summary:
        try:
            summary = run(["git", "log", "-1", "--pretty=%s"])
        except Exception as e:
            print(f"Error obteniendo último commit: {e}", file=sys.stderr)
            sys.exit(1)

    try:
        files = run(["git", "diff", "--name-only", f"{args.base}...HEAD"])
    except Exception as e:
        print(f"Error ejecutando git diff: {e}", file=sys.stderr)
        sys.exit(1)

    prompts = {
        "mejora": "Genera una descripción, ventajas y desventajas de esta mejora:",
        "bug": "Describe el bug, cómo reproducirlo y cuál es el comportamiento esperado:",
    }
    print(prompts.get(args.type.lower(), "Describe el issue:"))
    title = f"{args.type.capitalize()}: {summary}"
    print(title)
    print()
    print("Changed files:")
    if files:
        for line in files.splitlines():
            print(line)
    else:
        print("(no hay archivos cambiados respecto a {base})".format(base=args.base))

if __name__ == "__main__":
    main()

#!/bin/bash

echo "=== 🔬 АНАЛИЗ ВСЕХ ВЕРСИЙ ZUZCOIN ==="
echo ""

# 1. Соберем все .sol файлы
FILES=$(find . -name "ZUZCOIN*.sol" -type f | head -20)

echo "📋 Найдено файлов: $(echo "$FILES" | wc -l)"
echo ""

# 2. Проверим каждую версию компилятора
echo "=== 🏗️ ВЕРСИИ КОМПИЛЯТОРА ==="
for file in $FILES; do
  if [ -f "$file" ]; then
    version=$(grep -i "pragma solidity" "$file" | head -1)
    echo "$(basename "$file"): $version"
  fi
done

echo ""
echo "=== 📏 РАЗМЕРЫ ФАЙЛОВ ==="
for file in $FILES; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    echo "$(basename "$file"): $lines строк"
  fi
done

echo ""
echo "=== 🔑 КОНСТРУКТОРЫ ==="
for file in $FILES; do
  if [ -f "$file" ]; then
    constructor=$(grep -i "constructor" "$file" | head -1)
    if [ ! -z "$constructor" ]; then
      echo "$(basename "$file"): конструктор найден"
    else
      echo "$(basename "$file"): БЕЗ конструктора"
    fi
  fi
done

echo ""
echo "=== 🎯 РЕКОМЕНДАЦИЯ ==="
echo "1. Сначала получи реальный байткод (Step 1)"
echo "2. Покажи мне список файлов (Step 2)"
echo "3. Тогда я найду точное совпадение"

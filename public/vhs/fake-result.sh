#!/bin/bash
# 약간의 딜레이를 주어 실제 분석 중인 느낌을 줍니다.
sleep 0.5
echo ""
echo "🐽 AI-Smell test for: https://gcloud.lovable.app"
echo ""
echo "## Analysis Report"
echo ""
echo "| Sniffer      | Score             | Details"
echo "| ------------ | ----------------- | -------"
sleep 0.3
echo "| **Domain**       | ██████████ 100% | 🎯 DEFINITIVE: Hosted on AI builder domain: lovable.app (almost certainly AI-generated)"
sleep 0.1
echo "| **TechStack**    | ████░░░░░░  40% | Vite + Tailwind (popular AI quick-start); Detected: Tailwind CSS, Vite"
sleep 0.1
echo "| **Meta**         | ██████████ 100% | AI builder detected in author tag: Lovable; Meta description contains AI placeholder text: \"Lovable Generated Project\"; Meta description is very short, possibly a default."
sleep 0.1
echo "| **Boilerplate**  | ██████████ 100% | Empty SPA skeleton (just root div, content likely AI-generated); Vite default build structure detected (common in AI-scaffolded projects)"
sleep 0.1
echo "| **Comments**     | ██████████ 100% | 2 TODO comment(s) in production code (likely AI-generated); 2 placeholder comments suggesting unfinished AI template; Lovable AI builder badge detected"
sleep 0.1
echo "| **ColorPalette** | ░░░░░░░░░░   0% | Color palette does not match common AI-generated patterns"
sleep 0.1
echo "| **Content**      | █████░░░░░  50% | Very little paragraph content on the page."
sleep 0.1
echo "| **Design**       | █████░░░░░  50% | Layout seems to be using older techniques (tables or floats), which might indicate a template."
sleep 0.1
echo "| **UIKit**        | ░░░░░░░░░░   0% | No common UI kits detected."
echo ""
sleep 0.3
echo "📊 Overall AI-Smell Score: 80%"
echo "Verdict: Highly likely AI-generated or low-effort template."
echo ""

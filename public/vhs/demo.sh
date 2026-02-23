#!/bin/bash
# VHS를 사용하여 demo.gif를 생성하는 명령어입니다.
# 프로젝트 루트 디렉토리에서 실행하세요.
docker run --rm -v "$PWD":/vhs ghcr.io/charmbracelet/vhs public/vhs/demo.tape

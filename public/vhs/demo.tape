Output ../demo.gif

Set Shell "bash"
Set FontSize 18
Set Width 1200
Set Height 800
Set Theme "Catppuccin Mocha"
Set Padding 40
Set BorderRadius 10
Set TypingSpeed 150ms

# 초기 설정: 사용자에게는 보이지 않게 alias 설정
Hide
Type "alias npm='./fake-demo.sh #'"
Enter
Type "alias ai-smell='./fake-result.sh #'"
Enter
Type "clear"
Enter
Show

# 1. Install 단계 (실제 명령어를 치는 것처럼 보임)
Type "npm install -g ai-smell"
Sleep 500ms
Enter
# fake-demo.sh의 출력이 자연스럽게 나옵니다.
Sleep 2s

# 2. 분석 시작
Type "ai-smell https://gcloud.lovable.app"
Sleep 500ms
Enter
# fake-result.sh의 출력이 자연스럽게 나오는 것을 기다림
Sleep 8s

# 최종 결과 화면 유지
Sleep 5s
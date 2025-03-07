# ReactNative + Typescript + Expo를 사용한 Reminder App

ReactNative + Typescript + Expo(SDK52)를 사용한 간단한 상단바 PUSH 알림 앱입니다.

<br/>

# 프로젝트 개요

매일 해야할 일이 있지만 자꾸 까먹게되어 알림 앱이 있으면 좋겠다고 생각했습니다.

스마트폰 상단바에 푸쉬 알림과 n가지의 할일이 남아있는지 표시해주고, 앱에 접속하여 할일을 모두 완료 처리 했을때 상단바 푸쉬 알림이 뜨지 않는 기능

그리고 매일 새벽에 batch가 돌면서 전날 완료 처리했던 할일들을 다시 초기화 해주는 기능을 원했습니다.

알림 앱과 TodoList 앱을 찾아보게 되었고 유료거나 원하는 기능과 다소간의 차이가 있어서 직접 개발하게 되었습니다.

<br/>

# Tech Skill Used

|        Category        |                                             Tech                                              |
| :--------------------: | :-------------------------------------------------------------------------------------------: |
| **프레임워크 및 언어** |                                  **ReactNative, TypeScript**                                  |
|      **스타일링**      |                                   **nativewind, tailwindcss**                                 |
|     **코드 관리**      |                                     **ESLint, Prettier**                                      |
|  **기타 라이브러리**   | **expo-router, expo-notifications, expo-background-fetch, expo-task-manager, async-storage**  |

<br/>

# 프로젝트 소개

- 스마트폰 상단바 PUSH 알림 제공
- 알림에 n개의 할일이 남아있는지 공지
- 할일이 모두 완료처리 되었다면 모든 알림 삭제
- 매일 00~09시 사이에 batch가 돌면서 모든 완료처리된 알림을 다시 활성화 및 상태바 알림 노출

<br/>

# 주요 기능

### 상단바 PUSH 알림 제공


<br/>

### Background 작업을 활용한 상태 초기화

# xChess Project Documentation

## 1. Overview
xChess is a premium mobile chess application built with React Native and Firebase. It offers three distinct game modes: Playing with AI, Playing with Friends, and Quick Match with random users.

## 2. Features

### 2.1 Game Modes
- **Play with Server/AI**: Challenge a Stockfish-powered engine with adjustable difficulty levels.
- **Play with Friend**: Invite existing friends or search for users by username to start a game.
- **Quick Match**: Automatic matchmaking system that pairs you with a random user of similar Elo rating.

### 2.2 Social & Authentication
- **User Authentication**: Secure login via Google Sign-In and Email/Password using Firebase Auth.
- **Profile Management**: Custom avatars, Elo rating tracking, and match history.
- **Friends System**: Send/Accept friend requests, see online status, and manage connections.
- **In-Game Chat**: Real-time messaging during matches (v2).



## 3. Technical Specification

### 3.1 Frontend (React Native)
- **Framework**: React Native (v0.84+) with TypeScript.
- **Navigation**: React Navigation (Stack and Tab).
- **State Management**: Zustand for global app state (Auth, UI).
- **Game Engine**: `chess.js` for move validation and game logic.
- **Styling**: 'Midnight Grandmaster' theme with high-fidelity components and minimal borders.

### 3.2 Backend (Firebase)
- **Firebase Auth**: Google and Email authentication.
- **Cloud Firestore**:
    - `users/{userId}`: `uid`, `displayName`, `photoURL`, `elo`, `friends[]`, `connectedAt`.
    - `games/{gameId}`: `players[]`, `fen` (board state), `moves[]`, `status` (active/won/draw), `lastMoveAt`.
    - `invites/{inviteId}`: `fromUid`, `toUid`, `status` (pending/accepted/rejected).
- **Cloud Functions**: For matchmaking logic and AI move generation (if offloaded).

## 4. UI/UX Design (Stitch MCP)
The app utilizes a custom **Midnight Grandmaster** design system:
- **Primary Color**: Deep Slate (#1E293B)
- **Accent Color**: Muted Gold (#EAC34A)
- **Typography**: Inter (High-fidelity editorial treatment)
- **Material**: Glassmorphism and tonal depth (no 1px borders).

## 5. Roadmap
- **Phase 1**: UI Design (Stitch) and Documentation.
- **Phase 2**: Firebase Auth and Profile Setup.
- **Phase 3**: Offline AI Mode.
- **Phase 4**: Real-time Multiplayer (Firestore sync).
- **Phase 5**: Matchmaking and Social features.

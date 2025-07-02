```mermaid
graph TD
  subgraph Client [CLIENT Next.js]
    A1[Auth Auth.js]
    A2[Contest UI]
    A3[Live Editor CM]
    A4[Results/Leaderboard]
  end

  subgraph Gateway [API - Next.js Handlers]
    B1
  end

  subgraph ContestSVC [Contest Service]
    C2[Create Contests<br>Join/Leave<br>Timer Mgmt]
  end

  subgraph SyncSVC [Code Sync Svc<br> Liveblocks]
    C3[Real-time editing]
  end

  subgraph ProblemSVC [Problem Service]
    D1[CRUD Problems<br>Add to contest<br>Fetch problem metadata]
  end

  subgraph SubmissionSVC [Submission Svc]
    E1[Accept code<br>Queue job]
  end

  subgraph EvalSVC [Code Evaluation Svc<br> Docker + Judge daemon]
    F1[Run testcases<br>Return verdict]
  end

  subgraph LeaderboardSVC [Leaderboard Svc]
    G1[Track scores/time<br>Send updates ws]
  end

  subgraph DB [PostgreSQL DB]
    H1[Users / Contests<br>Submissions / Scores<br>Problems / Testcases]
  end

  %% Connections
  A1 --> B1
  A2 --> B1
  A3 --> B1
  A4 --> B1

  B1 --> C2
  B1 --> C3
  C2 --> D1
  D1 --> E1
  E1 --> F1
  F1 --> G1
  G1 --> H1
  D1 --> H1
  C2 --> H1
  E1 --> H1

#!/usr/bin/env bash
# Seed the 90-Day Interview Warfare project into the Goal Tracker repo
# Uses gh CLI to create milestone, labels, daily log issue, and all goal issues

set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"

REPO="MutharasuArchunan13/MutharasuArchunan13.github.io"
PROJECT_SLUG="90-day-interview-warfare"

echo "=== Creating Milestone ==="
MILESTONE_NUMBER=$(gh api repos/$REPO/milestones -X POST \
  -f title="90-Day Interview Warfare" \
  -f description="5.4 LPA → 30-85+ LPA. 90 days of DSA, System Design, Behavioral prep. Target: Senior Backend Engineer at PayPal / Google / Stripe. 200 LC problems, 15 system designs, 30 concepts, 12 mocks, 8 STAR stories." \
  -f due_on="2026-06-01T00:00:00Z" \
  --jq '.number')
echo "Milestone created: #$MILESTONE_NUMBER"

echo "=== Creating Labels ==="
create_label() {
  gh api repos/$REPO/labels -X POST -f name="$1" -f color="$2" -f description="$3" 2>/dev/null || true
}

# Project label
create_label "project:$PROJECT_SLUG" "6366f1" "Project: 90-Day Interview Warfare"

# Category labels
create_label "category:dsa" "8b5cf6" "Data Structures & Algorithms"
create_label "category:system-design" "0ea5e9" "System Design"
create_label "category:behavioral" "f59e0b" "Behavioral / STAR Stories"
create_label "category:concepts" "10b981" "Concept Deep-Dives"
create_label "category:review" "ec4899" "Weekly Review & Mocks"

echo "=== Creating Daily Log Issue ==="
DAILY_LOG_NUMBER=$(gh api repos/$REPO/issues -X POST \
  -f title="📋 Daily Log — $PROJECT_SLUG" \
  -f body="This issue tracks daily check-ins for the 90-Day Interview Warfare project. Each comment represents a day's work." \
  -f "labels[]=$PROJECT_SLUG" -f "labels[]=project:$PROJECT_SLUG" -f "labels[]=type:dailylog" \
  -f milestone="$MILESTONE_NUMBER" \
  --jq '.number' 2>/dev/null || \
  gh api repos/$REPO/issues -X POST \
  -f title="📋 Daily Log — $PROJECT_SLUG" \
  -f body="This issue tracks daily check-ins for the 90-Day Interview Warfare project. Each comment represents a day's work." \
  --jq '.number')
echo "Daily log issue: #$DAILY_LOG_NUMBER"

# Add labels to daily log separately (handles label creation race)
gh api repos/$REPO/issues/$DAILY_LOG_NUMBER/labels -X POST \
  -f "labels[]=project:$PROJECT_SLUG" -f "labels[]=type:dailylog" 2>/dev/null || true

echo "=== Creating tracker-config.json ==="
CONFIG_JSON=$(cat <<'ENDJSON'
{
  "projects": {
    "90-day-interview-warfare": {
      "phases": [
        { "name": "Foundation & DSA", "startDay": 1, "endDay": 28, "description": "Arrays, Hashmaps, Linked Lists, Trees, Graphs, DP, Intervals, Bit Manipulation — 70+ LeetCode problems" },
        { "name": "System Design & Depth", "startDay": 29, "endDay": 56, "description": "15 system designs + continued LC. 2 designs/week + advanced patterns" },
        { "name": "Interview Simulation", "startDay": 57, "endDay": 90, "description": "12+ mock interviews — DSA, System Design, Behavioral. Full interview mode." }
      ],
      "categories": ["dsa", "system-design", "behavioral", "concepts", "review"],
      "dailyLogIssueNumber": DAILY_LOG_PLACEHOLDER,
      "startDate": "2026-03-03",
      "totalDays": 90
    }
  }
}
ENDJSON
)

CONFIG_JSON="${CONFIG_JSON/DAILY_LOG_PLACEHOLDER/$DAILY_LOG_NUMBER}"
ENCODED=$(echo "$CONFIG_JSON" | base64 -w 0)

# Check if config already exists
EXISTING_SHA=$(gh api repos/$REPO/contents/tracker-config.json --jq '.sha' 2>/dev/null || echo "")

if [ -n "$EXISTING_SHA" ]; then
  gh api repos/$REPO/contents/tracker-config.json -X PUT \
    -f message="chore: seed 90-day project config" \
    -f content="$ENCODED" \
    -f sha="$EXISTING_SHA" > /dev/null
else
  gh api repos/$REPO/contents/tracker-config.json -X PUT \
    -f message="chore: seed 90-day project config" \
    -f content="$ENCODED" > /dev/null
fi
echo "Config saved"

echo "=== Creating Goal Issues ==="

# Helper to create a goal issue
# Usage: create_goal "title" "body" "category" "priority" day_number
create_goal() {
  local title="$1"
  local body="$2"
  local category="$3"
  local priority="$4"
  local day="$5"

  gh api repos/$REPO/issues -X POST \
    -f title="$title" \
    -f body="$body" \
    -f "labels[]=project:$PROJECT_SLUG" \
    -f "labels[]=type:goal" \
    -f "labels[]=status:todo" \
    -f "labels[]=category:$category" \
    -f "labels[]=priority:$priority" \
    -f "labels[]=day:$day" \
    -f milestone="$MILESTONE_NUMBER" \
    --jq '.number' 2>/dev/null
  echo -n "."
}

echo ""
echo "--- Phase 1: Foundation & DSA (Days 1-28) ---"

# Week 1: Arrays, Hashmaps, Two Pointers, Sliding Window
echo -n "Week 1: "
create_goal "Two Sum (#1)" "Solve LeetCode #1 - Two Sum\nPattern: Hashmap\nTime target: 15 min" "dsa" "high" 1
create_goal "Contains Duplicate (#217)" "Solve LeetCode #217 - Contains Duplicate\nPattern: Hashmap/Set\nTime target: 10 min" "dsa" "high" 1
create_goal "Valid Anagram (#242)" "Solve LeetCode #242 - Valid Anagram\nPattern: Hashmap frequency count\nTime target: 10 min" "dsa" "high" 1
create_goal "Group Anagrams (#49)" "Solve LeetCode #49 - Group Anagrams\nPattern: Hashmap with sorted key\nTime target: 15 min" "dsa" "high" 2
create_goal "Top K Frequent Elements (#347)" "Solve LeetCode #347 - Top K Frequent Elements\nPattern: Bucket Sort / Heap\nTime target: 15 min" "dsa" "high" 2
create_goal "Product of Array Except Self (#238)" "Solve LeetCode #238 - Product of Array Except Self\nPattern: Prefix/Suffix products\nTime target: 15 min" "dsa" "high" 2
create_goal "Maximum Subarray (#53)" "Solve LeetCode #53 - Maximum Subarray\nPattern: Kadane's Algorithm\nTime target: 10 min" "dsa" "high" 3
create_goal "Best Time to Buy & Sell Stock (#121)" "Solve LeetCode #121 - Best Time to Buy and Sell Stock\nPattern: Sliding Window / Min tracking\nTime target: 10 min" "dsa" "high" 3
create_goal "Encode and Decode Strings (#271)" "Solve LeetCode #271 - Encode and Decode Strings\nPattern: String Design / Delimiter\nTime target: 15 min" "dsa" "medium" 3
create_goal "Longest Consecutive Sequence (#128)" "Solve LeetCode #128 - Longest Consecutive Sequence\nPattern: HashSet\nTime target: 15 min" "dsa" "high" 4
create_goal "Valid Palindrome (#125)" "Solve LeetCode #125 - Valid Palindrome\nPattern: Two Pointers\nTime target: 10 min" "dsa" "medium" 4
create_goal "3Sum (#15)" "Solve LeetCode #15 - 3Sum\nPattern: Two Pointers + Sort\nTime target: 20 min" "dsa" "high" 4
create_goal "Container With Most Water (#11)" "Solve LeetCode #11 - Container With Most Water\nPattern: Two Pointers\nTime target: 15 min" "dsa" "high" 5
create_goal "Valid Parentheses (#20)" "Solve LeetCode #20 - Valid Parentheses\nPattern: Stack\nTime target: 10 min" "dsa" "high" 5
create_goal "Search in Rotated Sorted Array (#33)" "Solve LeetCode #33 - Search in Rotated Sorted Array\nPattern: Binary Search\nTime target: 20 min" "dsa" "high" 5
create_goal "Find Min in Rotated Sorted Array (#153)" "Solve LeetCode #153 - Find Minimum in Rotated Sorted Array\nPattern: Binary Search\nTime target: 15 min" "dsa" "high" 6
create_goal "Maximum Product Subarray (#152)" "Solve LeetCode #152 - Maximum Product Subarray\nPattern: DP / Kadane Variant\nTime target: 15 min" "dsa" "high" 6
create_goal "Longest Substring Without Repeating (#3)" "Solve LeetCode #3 - Longest Substring Without Repeating Characters\nPattern: Sliding Window\nTime target: 15 min" "dsa" "high" 6
create_goal "Minimum Window Substring (#76)" "Solve LeetCode #76 - Minimum Window Substring\nPattern: Sliding Window (Hard)\nTime target: 30 min" "dsa" "critical" 7
create_goal "Longest Repeating Character Replacement (#424)" "Solve LeetCode #424 - Longest Repeating Character Replacement\nPattern: Sliding Window\nTime target: 20 min" "dsa" "high" 7
create_goal "Trapping Rain Water (#42)" "Solve LeetCode #42 - Trapping Rain Water\nPattern: Two Pointers (Hard)\nTime target: 25 min" "dsa" "critical" 7
echo ""

# Week 2: Linked Lists, Matrix, DP Foundations
echo -n "Week 2: "
create_goal "Reverse Linked List (#206)" "Solve LeetCode #206 - Reverse Linked List\nPattern: Linked List iterative + recursive\nTime target: 10 min" "dsa" "high" 8
create_goal "Merge Two Sorted Lists (#21)" "Solve LeetCode #21 - Merge Two Sorted Lists\nPattern: Linked List merge\nTime target: 10 min" "dsa" "high" 8
create_goal "Linked List Cycle (#141)" "Solve LeetCode #141 - Linked List Cycle\nPattern: Fast & Slow Pointers\nTime target: 10 min" "dsa" "high" 8
create_goal "Reorder List (#143)" "Solve LeetCode #143 - Reorder List\nPattern: Fast/Slow + Reverse + Merge\nTime target: 20 min" "dsa" "high" 9
create_goal "Remove Nth Node From End (#19)" "Solve LeetCode #19 - Remove Nth Node From End of List\nPattern: Two Pointers\nTime target: 15 min" "dsa" "high" 9
create_goal "Merge K Sorted Lists (#23)" "Solve LeetCode #23 - Merge K Sorted Lists\nPattern: Heap / Divide & Conquer\nTime target: 25 min" "dsa" "critical" 9
create_goal "Set Matrix Zeroes (#73)" "Solve LeetCode #73 - Set Matrix Zeroes\nPattern: Matrix in-place\nTime target: 15 min" "dsa" "medium" 10
create_goal "Spiral Matrix (#54)" "Solve LeetCode #54 - Spiral Matrix\nPattern: Matrix Simulation\nTime target: 15 min" "dsa" "medium" 10
create_goal "Rotate Image (#48)" "Solve LeetCode #48 - Rotate Image\nPattern: Matrix Transpose + Reverse\nTime target: 15 min" "dsa" "medium" 10
create_goal "Word Search (#79)" "Solve LeetCode #79 - Word Search\nPattern: Backtracking on grid\nTime target: 20 min" "dsa" "high" 11
create_goal "Combination Sum (#39)" "Solve LeetCode #39 - Combination Sum\nPattern: Backtracking\nTime target: 15 min" "dsa" "high" 11
create_goal "Climbing Stairs (#70)" "Solve LeetCode #70 - Climbing Stairs\nPattern: DP (Fibonacci)\nTime target: 10 min" "dsa" "high" 11
create_goal "Coin Change (#322)" "Solve LeetCode #322 - Coin Change\nPattern: DP unbounded knapsack\nTime target: 20 min" "dsa" "high" 12
create_goal "House Robber (#198)" "Solve LeetCode #198 - House Robber\nPattern: DP\nTime target: 15 min" "dsa" "high" 12
create_goal "House Robber II (#213)" "Solve LeetCode #213 - House Robber II\nPattern: DP Circular\nTime target: 15 min" "dsa" "high" 12
create_goal "Decode Ways (#91)" "Solve LeetCode #91 - Decode Ways\nPattern: DP\nTime target: 15 min" "dsa" "high" 13
create_goal "Unique Paths (#62)" "Solve LeetCode #62 - Unique Paths\nPattern: DP Grid\nTime target: 10 min" "dsa" "medium" 13
create_goal "Jump Game (#55)" "Solve LeetCode #55 - Jump Game\nPattern: Greedy\nTime target: 15 min" "dsa" "high" 13
create_goal "Word Break (#139)" "Solve LeetCode #139 - Word Break\nPattern: DP + Trie\nTime target: 20 min" "dsa" "high" 14
create_goal "Longest Increasing Subsequence (#300)" "Solve LeetCode #300 - Longest Increasing Subsequence\nPattern: DP + Binary Search\nTime target: 20 min" "dsa" "high" 14
create_goal "Week 2 Review: Re-solve 2 hardest problems" "Go back and re-solve the 2 problems you struggled with most this week without looking at solutions." "review" "high" 14
echo ""

# Week 3: Trees & Tries
echo -n "Week 3: "
create_goal "Invert Binary Tree (#226)" "Solve LeetCode #226 - Invert Binary Tree\nPattern: Tree DFS\nTime target: 5 min" "dsa" "medium" 15
create_goal "Maximum Depth of Binary Tree (#104)" "Solve LeetCode #104 - Maximum Depth of Binary Tree\nPattern: Tree DFS\nTime target: 5 min" "dsa" "medium" 15
create_goal "Same Tree (#100)" "Solve LeetCode #100 - Same Tree\nPattern: Tree DFS\nTime target: 10 min" "dsa" "medium" 15
create_goal "Subtree of Another Tree (#572)" "Solve LeetCode #572 - Subtree of Another Tree\nPattern: Tree DFS\nTime target: 15 min" "dsa" "medium" 15
create_goal "LCA of BST (#235)" "Solve LeetCode #235 - Lowest Common Ancestor of a BST\nPattern: BST Property\nTime target: 10 min" "dsa" "high" 16
create_goal "Binary Tree Level Order Traversal (#102)" "Solve LeetCode #102 - Binary Tree Level Order Traversal\nPattern: BFS\nTime target: 10 min" "dsa" "high" 16
create_goal "Validate BST (#98)" "Solve LeetCode #98 - Validate Binary Search Tree\nPattern: DFS + Range check\nTime target: 15 min" "dsa" "high" 16
create_goal "Kth Smallest in BST (#230)" "Solve LeetCode #230 - Kth Smallest Element in a BST\nPattern: Inorder Traversal\nTime target: 10 min" "dsa" "high" 17
create_goal "Construct BT from Preorder & Inorder (#105)" "Solve LeetCode #105 - Construct Binary Tree from Preorder and Inorder Traversal\nPattern: Recursive Build\nTime target: 20 min" "dsa" "high" 17
create_goal "Binary Tree Maximum Path Sum (#124)" "Solve LeetCode #124 - Binary Tree Maximum Path Sum\nPattern: DFS + Global Max\nTime target: 25 min" "dsa" "critical" 17
create_goal "Serialize & Deserialize Binary Tree (#297)" "Solve LeetCode #297 - Serialize and Deserialize Binary Tree\nPattern: BFS/DFS + Design (Hard)\nTime target: 25 min" "dsa" "critical" 18
create_goal "Implement Trie (#208)" "Solve LeetCode #208 - Implement Trie (Prefix Tree)\nPattern: Trie\nTime target: 15 min" "dsa" "high" 18
create_goal "Add and Search Word (#211)" "Solve LeetCode #211 - Design Add and Search Words Data Structure\nPattern: Trie + DFS\nTime target: 20 min" "dsa" "high" 18
create_goal "Word Search II (#212)" "Solve LeetCode #212 - Word Search II\nPattern: Trie + Backtracking (Hard)\nTime target: 30 min" "dsa" "critical" 19
create_goal "Median of Two Sorted Arrays (#4)" "Solve LeetCode #4 - Median of Two Sorted Arrays\nPattern: Binary Search (Hard)\nTime target: 30 min" "dsa" "critical" 19
echo ""

# Week 4: Graphs, Intervals & Bit Manipulation
echo -n "Week 4: "
create_goal "Number of Islands (#200)" "Solve LeetCode #200 - Number of Islands\nPattern: BFS/DFS Grid\nTime target: 15 min" "dsa" "high" 20
create_goal "Clone Graph (#133)" "Solve LeetCode #133 - Clone Graph\nPattern: DFS + HashMap\nTime target: 15 min" "dsa" "high" 20
create_goal "Pacific Atlantic Water Flow (#417)" "Solve LeetCode #417 - Pacific Atlantic Water Flow\nPattern: Multi-source DFS\nTime target: 20 min" "dsa" "high" 20
create_goal "Course Schedule (#207)" "Solve LeetCode #207 - Course Schedule\nPattern: Topological Sort\nTime target: 15 min" "dsa" "high" 21
create_goal "Course Schedule II (#210)" "Solve LeetCode #210 - Course Schedule II\nPattern: Topological Sort\nTime target: 15 min" "dsa" "high" 21
create_goal "Number of Connected Components (#323)" "Solve LeetCode #323 - Number of Connected Components\nPattern: Union Find / DFS\nTime target: 15 min" "dsa" "high" 21
create_goal "Graph Valid Tree (#261)" "Solve LeetCode #261 - Graph Valid Tree\nPattern: Union Find\nTime target: 15 min" "dsa" "high" 22
create_goal "Alien Dictionary (#269)" "Solve LeetCode #269 - Alien Dictionary\nPattern: Topological Sort (Hard)\nTime target: 25 min" "dsa" "critical" 22
create_goal "Longest Common Subsequence (#1143)" "Solve LeetCode #1143 - Longest Common Subsequence\nPattern: 2D DP\nTime target: 15 min" "dsa" "high" 22
create_goal "Meeting Rooms (#252)" "Solve LeetCode #252 - Meeting Rooms\nPattern: Intervals + Sort\nTime target: 10 min" "dsa" "medium" 23
create_goal "Meeting Rooms II (#253)" "Solve LeetCode #253 - Meeting Rooms II\nPattern: Intervals + Heap\nTime target: 15 min" "dsa" "high" 23
create_goal "Non-Overlapping Intervals (#435)" "Solve LeetCode #435 - Non-Overlapping Intervals\nPattern: Greedy\nTime target: 15 min" "dsa" "high" 23
create_goal "Merge Intervals (#56)" "Solve LeetCode #56 - Merge Intervals\nPattern: Intervals + Sort\nTime target: 15 min" "dsa" "high" 24
create_goal "Insert Interval (#57)" "Solve LeetCode #57 - Insert Interval\nPattern: Intervals\nTime target: 15 min" "dsa" "high" 24
create_goal "Find Median from Data Stream (#295)" "Solve LeetCode #295 - Find Median from Data Stream\nPattern: Two Heaps (Hard)\nTime target: 25 min" "dsa" "critical" 24
create_goal "Sum of Two Integers (#371)" "Solve LeetCode #371 - Sum of Two Integers\nPattern: Bit Manipulation\nTime target: 15 min" "dsa" "medium" 25
create_goal "Number of 1 Bits (#191)" "Solve LeetCode #191 - Number of 1 Bits\nPattern: Bit Manipulation\nTime target: 5 min" "dsa" "low" 25
create_goal "Counting Bits (#338)" "Solve LeetCode #338 - Counting Bits\nPattern: Bit DP\nTime target: 10 min" "dsa" "medium" 25
create_goal "Reverse Bits (#190)" "Solve LeetCode #190 - Reverse Bits\nPattern: Bit Manipulation\nTime target: 10 min" "dsa" "low" 25
create_goal "Missing Number (#268)" "Solve LeetCode #268 - Missing Number\nPattern: XOR / Math\nTime target: 5 min" "dsa" "low" 25
create_goal "Phase 1 Review: Re-solve 5 hardest problems" "Days 26-28: Review all Phase 1 problems. Re-solve the 5 hardest without hints." "review" "high" 26
create_goal "Phase 1 Review: Pattern cheat sheet" "Days 26-28: Create a personal cheat sheet of all patterns covered (Hashmap, Two Pointers, Sliding Window, DP, Trees, Graphs, etc.)" "review" "high" 27
echo ""

# ===== Phase 1 Concepts =====
echo -n "Concepts (Phase 1): "
create_goal "Concept: Python GIL" "Deep-dive: Why GIL exists, impact on threading vs multiprocessing. 20 min read." "concepts" "medium" 1
create_goal "Concept: Python asyncio event loop" "Deep-dive: How asyncio event loop actually works under the hood. 20 min read." "concepts" "medium" 3
create_goal "Concept: Python Memory Model" "Deep-dive: Reference counting, gc module, circular references. 20 min read." "concepts" "medium" 5
create_goal "Concept: JVM Memory Regions" "Deep-dive: Heap, Stack, Metaspace, how they interact. 20 min read." "concepts" "medium" 7
create_goal "Concept: G1GC vs ZGC" "Deep-dive: When to use which garbage collector. Pause time vs throughput. 20 min read." "concepts" "medium" 9
create_goal "Concept: JIT Compilation" "Deep-dive: C1/C2 compilers, tiered compilation, warm-up. 20 min read." "concepts" "medium" 11
create_goal "Concept: volatile vs synchronized vs CAS" "Deep-dive: Java concurrency primitives and their memory semantics. 20 min read." "concepts" "medium" 13
create_goal "Concept: Idempotency Keys" "Deep-dive: Stripe's implementation of idempotency. How to make APIs idempotent. 20 min read." "concepts" "high" 15
create_goal "Concept: API Versioning Strategies" "Deep-dive: URL vs header vs query param versioning. Trade-offs. 20 min read." "concepts" "medium" 17
create_goal "Concept: B-tree vs LSM-tree Indexes" "Deep-dive: How databases index data. Read vs write optimization. 20 min read." "concepts" "high" 19
create_goal "Concept: MVCC in Postgres" "Deep-dive: Multi-Version Concurrency Control. How Postgres handles concurrent transactions. 20 min read." "concepts" "high" 21
create_goal "Concept: Connection Pooling (PgBouncer)" "Deep-dive: Why connection pooling matters. PgBouncer modes. 20 min read." "concepts" "medium" 23
create_goal "Concept: EXPLAIN ANALYZE" "Deep-dive: Reading Postgres query plans. Seq scan vs index scan. 20 min read." "concepts" "high" 25
echo ""

# ===== Phase 2: System Design =====
echo ""
echo "--- Phase 2: System Design & Depth (Days 29-56) ---"
echo -n "System Designs: "
create_goal "System Design: Payment Gateway (Stripe-like)" "Design a payment gateway system.\nRequirements → High-Level → Deep Dive (Data Model + API + Key Decisions) → Scaling → Interview Check\nRef: DDIA Ch.7, Alex Xu" "system-design" "critical" 29
create_goal "System Design: Rate Limiter" "Design a distributed rate limiter.\nToken bucket, sliding window, fixed window algorithms.\nRef: Alex Xu Ch.4" "system-design" "critical" 31
create_goal "System Design: URL Shortener" "Design a URL shortening service (like bit.ly).\nBase62 encoding, hash collisions, analytics.\nRef: Alex Xu Ch.8" "system-design" "high" 33
create_goal "System Design: Notification System" "Design a notification system (push, email, SMS).\nPriority queues, rate limiting, templates.\nRef: Alex Xu Ch.10" "system-design" "high" 35
create_goal "System Design: Chat System (WhatsApp)" "Design a real-time chat system.\nWebSockets, message ordering, delivery receipts.\nRef: Alex Xu Ch.12" "system-design" "critical" 37
create_goal "System Design: News Feed / Timeline" "Design a news feed system (like Twitter/Facebook).\nFanout on write vs read, ranking.\nRef: Alex Xu Ch.11" "system-design" "high" 39
create_goal "System Design: Search Autocomplete" "Design a search autocomplete system.\nTrie, ranking, caching, prefix matching.\nRef: Alex Xu Ch.13" "system-design" "high" 41
create_goal "System Design: Distributed Cache" "Design a distributed caching system.\nConsistent hashing, eviction policies, replication.\nRef: DDIA Ch.5" "system-design" "critical" 43
create_goal "System Design: OAuth 2.0 / Identity Provider" "Design an identity provider with OAuth 2.0 + OIDC.\nYour domain expertise — draw from IdP architecture experience." "system-design" "critical" 45
create_goal "System Design: ETL Pipeline at Scale" "Design a large-scale ETL pipeline.\nAirflow, idempotency, exactly-once, backpressure.\nYour domain expertise." "system-design" "high" 47
create_goal "System Design: Distributed Job Scheduler" "Design a distributed job scheduler.\nLeader election, task assignment, retry.\nRef: DDIA Ch.9" "system-design" "high" 49
create_goal "System Design: Key-Value Store" "Design a distributed key-value store.\nPartitioning, replication, consistency.\nRef: DDIA Ch.6" "system-design" "critical" 51
create_goal "System Design: Web Crawler" "Design a web crawler at scale.\nPoliteness, dedup, URL frontier.\nRef: Alex Xu Ch.9" "system-design" "high" 53
create_goal "System Design: Ticket Booking (BookMyShow)" "Design a ticket booking system.\nSeat locking, consistency, race conditions.\nRef: Distributed locks." "system-design" "high" 55
create_goal "System Design: Distributed Logging System" "Design a distributed logging/observability system.\nELK stack, structured logging, retention.\nRef: Observability." "system-design" "high" 56
echo ""

# Phase 2 Concepts
echo -n "Concepts (Phase 2): "
create_goal "Concept: CAP Theorem" "Deep-dive: CAP theorem and why it's oversimplified. Real-world trade-offs. 20 min." "concepts" "high" 30
create_goal "Concept: Saga Pattern vs 2PC" "Deep-dive: Distributed transactions. Choreography vs orchestration. 20 min." "concepts" "high" 32
create_goal "Concept: Event Sourcing & CQRS" "Deep-dive: Event-driven architecture patterns. When to use, trade-offs. 20 min." "concepts" "high" 34
create_goal "Concept: Exactly-Once Semantics" "Deep-dive: At-least-once vs at-most-once vs exactly-once. Kafka, idempotent consumers. 20 min." "concepts" "high" 36
create_goal "Concept: Consistent Hashing" "Deep-dive: Virtual nodes, ring-based distribution, rebalancing. 20 min." "concepts" "high" 38
create_goal "Concept: Leader Election (Raft & Paxos)" "Deep-dive: Consensus algorithms basics. Raft log replication. 20 min." "concepts" "high" 40
create_goal "Concept: RED Method + USE Method" "Deep-dive: Observability frameworks. Rate/Error/Duration, Utilization/Saturation/Errors. 20 min." "concepts" "medium" 42
create_goal "Concept: SLI / SLO / SLA Definitions" "Deep-dive: Service level indicators, objectives, agreements. Error budgets. 20 min." "concepts" "medium" 44
create_goal "Concept: PCI-DSS Awareness" "Deep-dive: PCI compliance for fintech. Card data handling, tokenization. 20 min." "concepts" "medium" 46
create_goal "Concept: Encryption at Rest / in Transit" "Deep-dive: TLS, AES, key management, envelope encryption. 20 min." "concepts" "medium" 48
echo ""

# ===== Phase 3: Interview Simulation =====
echo ""
echo "--- Phase 3: Interview Simulation (Days 57-90) ---"
echo -n "Mocks & Behavioral: "
create_goal "Mock Interview 1: DSA" "Full 45-min DSA mock. Timed, no hints. Log score + feedback." "review" "critical" 58
create_goal "Mock Interview 2: System Design" "Full 45-min System Design mock. Choose a design, present end-to-end." "review" "critical" 60
create_goal "Mock Interview 3: Behavioral" "Full 30-min behavioral mock. Practice 3 STAR stories." "review" "critical" 62
create_goal "Mock Interview 4: DSA" "Full 45-min DSA mock. Focus on weak patterns." "review" "critical" 65
create_goal "Mock Interview 5: System Design" "Full 45-min System Design mock. Different design than Mock 2." "review" "critical" 67
create_goal "Mock Interview 6: Behavioral" "Full 30-min behavioral mock. New stories." "review" "critical" 69
create_goal "Mock Interview 7: DSA" "Full 45-min DSA mock. Hard problems only." "review" "critical" 72
create_goal "Mock Interview 8: System Design" "Full 45-min System Design mock. Payment/fintech domain." "review" "critical" 74
create_goal "Mock Interview 9: Full Loop Simulation" "Simulate a full interview loop: DSA + System Design + Behavioral. 2 hours." "review" "critical" 77
create_goal "Mock Interview 10: DSA" "Full 45-min DSA mock. Final pattern review." "review" "critical" 80
create_goal "Mock Interview 11: System Design" "Full 45-min System Design mock. Final design review." "review" "critical" 83
create_goal "Mock Interview 12: Full Loop Simulation" "Final full loop simulation before real interviews. 2 hours." "review" "critical" 87
echo ""

# Behavioral Stories
echo -n "Behavioral Stories: "
create_goal "STAR Story: Centralized IdP Architecture" "Write full STAR + DEPTH story.\nSituation: Designed auth for 5 products with OAuth 2.0 + OIDC\nResult: Eliminated 3 duplicate auth systems, reduced auth bugs ~70%" "behavioral" "critical" 57
create_goal "STAR Story: Typesense Production Debugging" "Write full STAR + DEPTH story.\nSituation: Diagnosed Raft consensus thread starvation\nResult: Identified root cause, proposed backpressure fix" "behavioral" "high" 59
create_goal "STAR Story: ETL Pipeline Design" "Write full STAR + DEPTH story.\nSituation: Built data pipeline from zero with Airflow + PySpark\nResult: Processing 200K+ records with idempotency" "behavioral" "high" 61
create_goal "STAR Story: Production Incident" "Write full STAR + DEPTH story.\nYour worst production fire — response + lesson learned." "behavioral" "high" 63
create_goal "STAR Story: Technical Trade-off" "Write full STAR + DEPTH story.\nA decision where you chose X over Y — reasoning and outcome." "behavioral" "high" 66
create_goal "STAR Story: Mentoring / Teaching" "Write full STAR + DEPTH story.\nTaught Java to 100+ students — communication and leadership." "behavioral" "medium" 68
create_goal "STAR Story: Conflict Resolution" "Write full STAR + DEPTH story.\nDisagreement with teammate/manager — professional resolution." "behavioral" "medium" 71
create_goal "STAR Story: Deadline Pressure" "Write full STAR + DEPTH story.\nShipped under pressure — what you prioritized and why." "behavioral" "medium" 73
echo ""

# Phase 3 Concepts
echo -n "Concepts (Phase 3): "
create_goal "Concept: OAuth 2.0 Full Flow" "Deep-dive: Whiteboard the full OAuth 2.0 flow in 5 min. Authorization code, implicit, client credentials." "concepts" "critical" 57
create_goal "Concept: PKCE + Token Binding" "Deep-dive: PKCE for public clients, token binding, DPoP. 20 min." "concepts" "high" 60
create_goal "Concept: Multi-tenant Session Management" "Deep-dive: How to handle sessions across tenants. Token scoping, isolation. 20 min." "concepts" "high" 63
create_goal "Concept: IAM Least-Privilege Design" "Deep-dive: AWS IAM, role-based access, policy design. 20 min." "concepts" "medium" 70
create_goal "Concept: Multi-Region Architecture" "Deep-dive: Active-active vs active-passive. Data replication trade-offs. 20 min." "concepts" "high" 75
create_goal "Concept: K8s Pod Scheduling + Graceful Shutdown" "Deep-dive: Scheduler, affinity, preStop hooks, SIGTERM handling. 20 min." "concepts" "medium" 80
create_goal "Concept: K8s HPA/VPA + Resource Limits" "Deep-dive: Horizontal/vertical pod autoscaling, requests vs limits. 20 min." "concepts" "medium" 85
echo ""

# Weekly reviews
echo -n "Weekly Reviews: "
for week in $(seq 1 12); do
  day=$((week * 7))
  if [ $day -gt 90 ]; then day=90; fi
  create_goal "Week $week Review" "Weekly review:\n- LC problems solved (target: 21)\n- LC without hints (target: 15+)\n- Concepts completed (target: 3-4)\n- System designs (Phase 2+: 2/week)\n- Spoke out loud (target: 7/7)\n- Days showed up (target: 7/7)\n- Wins, Struggles, Next week priorities" "review" "high" $day
done
echo ""

echo ""
echo "=== DONE ==="
echo "Milestone: #$MILESTONE_NUMBER"
echo "Daily Log: #$DAILY_LOG_NUMBER"
echo "All goals created successfully!"

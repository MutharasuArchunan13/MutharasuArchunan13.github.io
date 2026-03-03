export function projectGenerationPrompt(description: string): string {
  return `You are a project planning assistant. Given a project description, generate a structured learning/project plan.

User's project description: "${description}"

Respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "title": "Project Title",
  "description": "2-3 sentence description",
  "totalDays": 30,
  "phases": [
    { "name": "Phase Name", "startDay": 1, "endDay": 10, "description": "Phase description" }
  ],
  "categories": ["category1", "category2"],
  "goals": [
    {
      "title": "Goal title",
      "description": "What to do and learn",
      "category": "category1",
      "priority": "medium",
      "day": 1
    }
  ]
}

Rules:
- Generate 15-50 goals depending on totalDays
- Distribute goals evenly across days
- Categories should be 3-6 meaningful groupings
- Priority: "low", "medium", "high", or "critical"
- Phases should cover the full duration
- Make goals specific and actionable`
}

export function dailySuggestionPrompt(
  pendingGoals: string[],
  completedCount: number,
  totalGoals: number,
  currentDay: number,
): string {
  return `You are a productivity coach. Based on current progress, give a brief daily suggestion.

Current day: ${currentDay}
Completed: ${completedCount}/${totalGoals} goals
Pending goals: ${pendingGoals.slice(0, 10).join(', ')}

Give a 2-3 sentence suggestion for today's focus. Be motivational but practical. No JSON, just plain text.`
}

export function contentParsingPrompt(text: string): string {
  return `Parse this content into structured goals/tasks. The content is a syllabus, roadmap, or outline.

Content:
${text}

Respond with ONLY valid JSON (no markdown, no code fences) as an array:
[
  {
    "title": "Goal title",
    "description": "Details",
    "category": "category-name",
    "priority": "medium"
  }
]

Rules:
- Extract every distinct topic/task as a separate goal
- Infer categories from content structure
- Priority: most fundamental = "high", advanced = "medium", optional = "low"
- Keep titles concise but descriptive`
}

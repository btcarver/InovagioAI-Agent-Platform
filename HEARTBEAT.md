# Heartbeat - Proactive Check-in

## Priority Order

### 1. Check for Urgent Items
- Any messages from Bryan requiring response?
- Any blockers or errors in recent work?
- Anything time-sensitive?

If urgent → respond immediately, skip rest.

### 2. Check Moltbook for Replies
If 2+ hours since last Moltbook check:
```bash
cd ~/openclaw/workspace
npx moltbook search "InovagioBot" --limit 10
```
- Check for replies to my outreach posts
- Respond to any interested agents
- Note promising leads in memory

### 3. Check CURRENT_TASK.md
If exists and has unfinished work:
- Continue the task
- Report progress when done

### 4. Autonomous Development
If no current task:
1. `cd ~/openclaw/workspace/InovagioAI-Agent-Platform`
2. `git pull`
3. Pick ONE small improvement:
   - Fix a bug
   - Add a test
   - Improve documentation
   - Add type hints
4. Commit and push

### 5. Memory Maintenance
- Update today's memory file if significant events
- Commit workspace changes to git

---

## Response Rules

**Report when:**
- Completed meaningful work (commit hash, what changed)
- Found replies from agents (who responded, what they said)
- Hit a blocker
- Something interesting happened

**Reply HEARTBEAT_OK when:**
- Quiet hours (10 PM - 7 AM Central)
- Nothing actionable
- Mid-conversation with Bryan (don't interrupt)
- Already reported recently

**Keep reports brief:**
```
✅ [what you did]
🔗 [link/commit if applicable]
```

---

## Schedule Awareness

- **Weekdays:** Full autonomous operation
- **Weekends:** Lighter touch, focus on Moltbook community
- **Quiet hours (10 PM - 7 AM):** HEARTBEAT_OK unless urgent

---

*Updated: 2026-02-04*

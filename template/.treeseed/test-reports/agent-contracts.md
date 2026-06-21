# Agent Contract Test Report

Generated: 2026-06-21T21:25:21.476Z
Repository: /home/adrian/Projects/treeseed/market/.treeseed/worktrees/demo-2a97516c35/starters/research/template
Status: PASS

## knowledge-generator-agent

Handler: report
Project agent class: knowledge
Enabled: true
Triggers: message
Declared outputs: knowledge_generated
Permissions: knowledge:create,update; message:create,pick,update
Status: PASS
Issues: none

## knowledge-optimizer-agent

Handler: report
Project agent class: knowledge
Enabled: true
Triggers: message
Declared outputs: knowledge_optimized
Permissions: knowledge:search,get,update; message:create,pick,update
Status: PASS
Issues: none

## planner-agent

Handler: plan
Project agent class: planning
Enabled: true
Triggers: startup
Declared outputs: question_priority_updated, objective_priority_updated
Permissions: question:search,get; objective:search,get; message:create,pick,update
Status: PASS
Issues: none

## reporter-agent

Handler: report
Project agent class: reporting
Enabled: true
Triggers: schedule
Declared outputs: report_created
Permissions: note:search,get; knowledge:search,get; message:create,pick,update
Status: PASS
Issues: none

## researcher-agent

Handler: research
Project agent class: research
Enabled: true
Triggers: message
Declared outputs: research_started, research_completed
Permissions: question:search,get; note:create; message:create,pick,update
Status: PASS
Issues: none


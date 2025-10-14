# Prompts Reference Guide

**Create intelligent conversation templates that guide developers through complex workflows.**

Prompts in MCP Dev Blueprints are pre-configured conversation starters that provide structured, guided interactions for common development tasks. They're perfect for standardizing workflows, onboarding new team members, and ensuring consistent processes across your organization.

## 🎯 What Are MCP Prompts?

Prompts are conversation templates that:
- **Guide Workflows** - Lead developers through multi-step processes
- **Ensure Consistency** - Standardize how tasks are approached
- **Transfer Knowledge** - Embed institutional wisdom into everyday workflows  
- **Reduce Cognitive Load** - Provide structure for complex decisions
- **Enable Self-Service** - Help developers solve problems independently

### Prompt vs. Tool vs. Resource

| Type | Purpose | Interaction Style | Example |
|------|---------|------------------|---------|
| **Prompt** | Guided conversation | Interactive, multi-turn | "Code Review Wizard", "Project Setup Guide" |
| **Tool** | Instructions & reference | One-time information | "Coding Standards", "API Guidelines" |
| **Resource** | Static documentation | Reference lookup | "API Spec", "Architecture Docs" |

---

## 📋 Prompt Structure & Schema

### Basic Prompt Schema

```json
{
    "id": "unique_prompt_identifier",
    "title": "Human-Readable Prompt Name", 
    "description": "What this prompt helps accomplish and when to use it",
    "messages": [
        {
            "role": "user|assistant|system",
            "content": {
                "type": "text",
                "text": "The conversation template content..."
            }
        }
    ]
}
```

### Message Roles

| Role | Purpose | When to Use |
|------|---------|-------------|
| `user` | Initial request from developer | Starting conversation, providing context |
| `assistant` | AI assistant guidance | Rarely used - let AI respond naturally |
| `system` | Behind-the-scenes context | Advanced use cases, behavior modification |

### Complete Prompt Example

```json
{
    "id": "comprehensive_code_review_workflow",
    "title": "Comprehensive Code Review Workflow Guide",
    "description": "Step-by-step code review process that ensures thorough analysis, constructive feedback, and knowledge sharing. Use this for all pull request reviews to maintain consistent quality standards.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "I need to conduct a thorough code review for a pull request. Please guide me through our comprehensive review process:\n\n**Pull Request Context:**\n- Repository: [REPOSITORY_NAME]\n- Branch: [FEATURE_BRANCH] → [TARGET_BRANCH]\n- Author: [DEVELOPER_NAME] \n- Type of changes: [FEATURE/BUGFIX/REFACTOR/DOCS]\n- Scope: [BRIEF_DESCRIPTION]\n\n**Review Objectives:**\n1. Ensure code quality and maintainability\n2. Verify functionality and edge case handling\n3. Check security and performance implications\n4. Provide constructive feedback for learning\n5. Ensure consistency with team standards\n\nPlease walk me through the review process step by step:\n\n1. **First**: Use our 'code_review_checklist' tool to understand review criteria\n2. **Then**: Guide me through systematic code analysis\n3. **Finally**: Help me write constructive, actionable feedback\n\nWhat should I examine first?"
            }
        }
    ]
}
```

---

## 🔧 Prompt Design Patterns

### Pattern 1: Multi-Step Workflow Guide

Perfect for complex processes that need structured guidance.

```json
{
    "id": "new_service_deployment_guide", 
    "title": "New Microservice Deployment Workflow",
    "description": "Complete guide for deploying new microservices from development through production, ensuring all quality gates and compliance requirements are met.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "I'm ready to deploy a new microservice to production. Please guide me through our complete deployment workflow:\n\n**Service Details:**\n- Service name: [SERVICE_NAME]\n- Technology stack: [TECH_STACK]\n- Dependencies: [LIST_DEPENDENCIES]\n- Expected load: [LOAD_CHARACTERISTICS]\n\n**Deployment Phases Required:**\n\n🏗️ **Phase 1: Pre-Deployment Preparation**\n- [ ] Use 'deployment_checklist' tool for requirements\n- [ ] Validate service configuration and secrets\n- [ ] Verify monitoring and alerting setup\n- [ ] Confirm rollback procedures\n\n🧪 **Phase 2: Staging Deployment**\n- [ ] Deploy to staging environment\n- [ ] Run integration tests\n- [ ] Performance testing\n- [ ] Security scanning\n\n🚀 **Phase 3: Production Rollout**\n- [ ] Canary deployment strategy\n- [ ] Health check validation\n- [ ] Monitoring confirmation\n- [ ] Team notification\n\n📊 **Phase 4: Post-Deployment**\n- [ ] Performance monitoring\n- [ ] Error rate analysis\n- [ ] Documentation updates\n- [ ] Retrospective notes\n\nWhich phase should we start with, and what's the current status of your service?"
            }
        }
    ]
}
```

### Pattern 2: Decision Tree Workflow

Guides users through conditional logic and branching decisions.

```json
{
    "id": "incident_response_decision_tree",
    "title": "Incident Response Decision Tree & Escalation Guide", 
    "description": "Intelligent incident response workflow that adapts based on severity, system impact, and available resources. Ensures proper escalation and communication.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "🚨 **INCIDENT RESPONSE ACTIVATION**\n\nI need help responding to a production incident. Please guide me through our decision tree:\n\n## Initial Assessment\n**Answer these questions to determine the response path:**\n\n1️⃣ **Severity Level** (choose one):\n   - **P0**: Complete service outage, security breach, data loss\n   - **P1**: Major feature broken, significant performance degradation  \n   - **P2**: Minor feature issues, some users affected\n   - **P3**: Cosmetic issues, edge cases\n\n2️⃣ **System Impact** (select all that apply):\n   - [ ] User-facing services down\n   - [ ] Payment processing affected\n   - [ ] Data integrity concerns\n   - [ ] Security implications\n   - [ ] Third-party integrations failing\n\n3️⃣ **Current Status**:\n   - Time detected: [TIMESTAMP]\n   - Detection method: [MONITORING/USER_REPORT/OTHER]\n   - Systems affected: [LIST_SYSTEMS]\n   - Error symptoms: [DESCRIBE_SYMPTOMS]\n\n## Response Actions\nBased on your answers, I'll provide:\n- ✅ Immediate response checklist\n- 📞 Escalation procedures\n- 🔍 Investigation guidance\n- 📢 Communication templates\n- 📝 Documentation requirements\n\n**What's the severity level and current situation?**\n\nFirst, let me use our 'incident_response_playbook' tool to review procedures..."
            }
        }
    ]
}
```

### Pattern 3: Knowledge Transfer & Onboarding

Helps new team members learn processes and standards.

```json
{
    "id": "new_developer_onboarding_journey",
    "title": "New Developer Onboarding Journey",
    "description": "Comprehensive onboarding workflow for new developers covering setup, standards, processes, and team integration over the first few weeks.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text", 
                "text": "👋 **Welcome to the Engineering Team!**\n\nI'm here to guide you through your onboarding journey. Let's customize your experience:\n\n## Your Background\n**Tell me about yourself:**\n- Role: [FRONTEND/BACKEND/FULLSTACK/DEVOPS/ETC]\n- Experience level: [JUNIOR/MID/SENIOR]\n- Previous technologies: [LIST_TECH_EXPERIENCE]\n- Learning preferences: [HANDS_ON/DOCUMENTATION/MENTORING]\n\n## Onboarding Track Selection\nBased on your background, I'll create a personalized plan:\n\n### 🏃‍♂️ **Week 1: Foundation Setup**\n- Development environment configuration\n- Access and permissions setup\n- Core tools and workflows introduction\n- First small contribution\n\n### 🚀 **Week 2: Deep Dive**\n- Architecture and system design overview\n- Code review process participation\n- Testing and quality practices\n- Team collaboration tools\n\n### 🎯 **Week 3: Integration**\n- Feature development ownership\n- Production deployment experience\n- Monitoring and debugging skills\n- Mentorship and knowledge sharing\n\n## Today's Goal\nLet's start with the essentials:\n\n1. **First**: I'll use our setup tools to understand current configurations\n2. **Then**: We'll establish your development environment\n3. **Finally**: Get you ready for your first contribution\n\n**What's your role and experience level? Also, do you have any specific areas you'd like to focus on first?**"
            }
        }
    ]
}
```

### Pattern 4: Problem Diagnosis & Troubleshooting

Interactive debugging and problem-solving guidance.

```json
{
    "id": "performance_debugging_assistant",
    "title": "Performance Issue Debugging Assistant",
    "description": "Systematic approach to diagnosing and resolving performance problems across frontend, backend, and infrastructure layers.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "🐌 **Performance Issue Investigation**\n\nI'm experiencing performance problems and need help diagnosing the root cause. Let's work through this systematically:\n\n## Initial Information\n**Please provide details about the performance issue:**\n\n### 📊 **Symptoms** (describe what you're observing):\n- Slow page loads: [YES/NO - if yes, which pages?]\n- API response delays: [YES/NO - which endpoints?]\n- High CPU/Memory usage: [YES/NO - which services?]\n- Database query slowness: [YES/NO - specific queries?]\n- Network latency: [YES/NO - which connections?]\n\n### ⏰ **Timing Information**:\n- When did this start: [TIMESTAMP/GRADUAL/UNKNOWN]\n- Frequency: [ALWAYS/INTERMITTENT/SPECIFIC_TIMES]\n- User impact: [ALL_USERS/SUBSET/SPECIFIC_REGIONS]\n\n### 🔍 **Context**:\n- Recent deployments: [YES/NO - what changed?]\n- Traffic patterns: [NORMAL/INCREASED/DECREASED]\n- Error rates: [NORMAL/ELEVATED]\n\n## Diagnostic Approach\nI'll guide you through:\n\n1. **Quick wins** - Immediate checks and fixes\n2. **Systematic investigation** - Layer-by-layer analysis\n3. **Root cause analysis** - Finding the underlying issue  \n4. **Resolution planning** - Steps to fix and prevent recurrence\n5. **Monitoring setup** - Preventing future issues\n\nLet me start by using our performance monitoring tools...\n\n**What symptoms are you seeing, and when did they start?**"
            }
        }
    ]
}
```

---

## 💡 Advanced Prompt Techniques

### Tool Integration & Orchestration

```json
{
    "id": "comprehensive_security_audit",
    "title": "Comprehensive Security Audit Workflow",
    "description": "Multi-layered security assessment combining automated tools with manual verification processes.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "🔒 **Security Audit Initiation**\n\nI need to perform a comprehensive security audit. Please orchestrate the complete process:\n\n## Audit Scope\n**Define the scope of your security audit:**\n- Application layer: [WEB_APP/API/MOBILE/ALL]\n- Infrastructure: [CLOUD/ON_PREMISE/HYBRID]\n- Data sensitivity: [PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED]\n- Compliance requirements: [SOC2/HIPAA/GDPR/PCI_DSS/NONE]\n\n## Multi-Stage Security Assessment\n\n### 🔍 **Stage 1: Automated Security Scanning**\nI'll coordinate multiple security tools:\n\n1. **Code Analysis**: Use 'security_code_scanner' tool\n   - Static analysis for vulnerabilities\n   - Dependency security assessment\n   - Secrets detection\n\n2. **Infrastructure Security**: Use 'infrastructure_security_checker' tool\n   - Configuration analysis\n   - Access control review\n   - Network security assessment\n\n3. **Application Security**: Use 'application_security_tester' tool\n   - Authentication/authorization testing\n   - Input validation checks\n   - Session management review\n\n### 🕵️ **Stage 2: Manual Verification**\n- Business logic security review\n- Privilege escalation testing\n- Social engineering vulnerability assessment\n\n### 📋 **Stage 3: Compliance Validation**\n- Regulatory requirement mapping\n- Evidence collection\n- Gap analysis and remediation planning\n\n### 📊 **Stage 4: Risk Assessment & Reporting**\n- Vulnerability prioritization\n- Risk scoring and impact analysis\n- Remediation roadmap creation\n\nI'll start by gathering information and running the appropriate tools based on your scope.\n\n**What's your audit scope, and are there specific compliance requirements I should consider?**"
            }
        }
    ]
}
```

### Context-Aware Personalization

```json
{
    "id": "personalized_development_coach",
    "title": "Personalized Development Coaching Session",
    "description": "AI-powered development coaching that adapts to individual skill levels, learning goals, and project context.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "👨‍🏫 **Personal Development Coaching Session**\n\nLet me provide personalized guidance based on your current situation and goals:\n\n## Developer Profile Assessment\n**Help me understand your current context:**\n\n### 🎯 **Current Focus** (what you're working on right now):\n- Project type: [FEATURE_DEVELOPMENT/BUG_FIX/REFACTORING/NEW_PROJECT]\n- Technology challenges: [LIST_CURRENT_CHALLENGES]\n- Immediate blockers: [WHAT'S_STOPPING_PROGRESS]\n\n### 📈 **Skill Development Goals**:\n- Technical skills to improve: [SPECIFIC_TECHNOLOGIES]\n- Soft skills focus: [COMMUNICATION/LEADERSHIP/MENTORING]\n- Career objectives: [TECH_LEAD/ARCHITECT/SPECIALIST/MANAGER]\n- Timeline: [3_MONTHS/6_MONTHS/1_YEAR]\n\n### 🔄 **Learning Style Preferences**:\n- [ ] Hands-on projects and experimentation\n- [ ] Reading documentation and technical articles\n- [ ] Video tutorials and courses\n- [ ] Pair programming and mentorship\n- [ ] Conference talks and community events\n\n## Personalized Coaching Plan\n\nBased on your profile, I'll:\n\n1. **Assess current situation** using relevant diagnostic tools\n2. **Identify skill gaps** and growth opportunities  \n3. **Create learning roadmap** with concrete milestones\n4. **Provide specific resources** tailored to your style\n5. **Set up progress tracking** with regular check-ins\n\n## Today's Session\nLet's start with your immediate needs:\n\n**What specific challenge are you facing right now, and how can I help you work through it?**\n\nI'll begin by using our relevant technical tools to understand your current context..."
            }
        }
    ]
}
```

### Progressive Complexity Handling

```json
{
    "id": "architecture_decision_facilitator",
    "title": "Architecture Decision Facilitation Workshop",
    "description": "Structured approach to making complex architectural decisions with stakeholder alignment and future-proofing considerations.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "🏗️ **Architecture Decision Workshop**\n\nI need to facilitate a complex architecture decision. Let's work through this systematically:\n\n## Decision Context\n**What architectural decision needs to be made?**\n\n### 🎯 **Decision Scope**:\n- Decision type: [TECHNOLOGY_CHOICE/PATTERN_SELECTION/INFRASTRUCTURE_DESIGN]\n- System area: [FRONTEND/BACKEND/DATA/INFRASTRUCTURE/INTEGRATION]\n- Impact level: [COMPONENT/SERVICE/SYSTEM/ORGANIZATION]\n- Timeline pressure: [IMMEDIATE/WEEKS/MONTHS/FLEXIBLE]\n\n### 👥 **Stakeholders**:\n- Technical decision makers: [LIST_PEOPLE_ROLES]\n- Business stakeholders: [PRODUCT/BUSINESS/COMPLIANCE]\n- External constraints: [VENDOR/PARTNER/REGULATORY]\n\n### 📋 **Requirements & Constraints**:\n- Functional requirements: [WHAT_MUST_IT_DO]\n- Non-functional requirements: [PERFORMANCE/SECURITY/SCALABILITY]\n- Business constraints: [BUDGET/TIMELINE/RESOURCES]\n- Technical constraints: [EXISTING_SYSTEMS/SKILLS/STANDARDS]\n\n## Decision Framework\n\nI'll guide you through our Architecture Decision Record (ADR) process:\n\n### 🔍 **Phase 1: Problem Analysis**\n- Use 'architecture_analysis' tool to understand current state\n- Identify decision drivers and success criteria\n- Map stakeholder concerns and priorities\n\n### 🎨 **Phase 2: Solution Design**\n- Generate alternative approaches\n- Use 'architecture_patterns' tool for proven solutions\n- Create proof-of-concept plans for evaluation\n\n### ⚖️ **Phase 3: Trade-off Analysis**\n- Use 'architecture_tradeoff_matrix' tool\n- Risk assessment and mitigation planning\n- Long-term evolution and maintenance considerations\n\n### 🤝 **Phase 4: Stakeholder Alignment**\n- Present options with clear trade-offs\n- Facilitate decision-making discussion\n- Document rationale and implementation plan\n\n### 📝 **Phase 5: Documentation & Communication**\n- Create comprehensive ADR document\n- Share decision and rationale with broader team\n- Set up success metrics and review points\n\n**Let's start: What architectural decision are you facing, and who are the key stakeholders involved?**"
            }
        }
    ]
}
```

---

## 🎨 Conversation Design Best Practices

### Writing Effective Conversation Starters

#### 1. **Clear Context Setting**
```markdown
## ✅ Good: Specific and Actionable
"I'm about to deploy a critical hotfix to production and need to follow our emergency deployment process..."

## ❌ Avoid: Vague and Generic  
"I need help with deployment..."
```

#### 2. **Progressive Information Gathering**
```markdown
## Multi-layered Information Collection

### Initial Context (required)
- What: [SPECIFIC_TASK_OR_PROBLEM]
- When: [TIMELINE_AND_URGENCY]  
- Who: [STAKEHOLDERS_AFFECTED]

### Technical Details (if applicable)
- Technology stack: [RELEVANT_TECHNOLOGIES]
- Environment: [DEV/STAGING/PRODUCTION]
- Scale: [USERS_AFFECTED/DATA_SIZE/TRAFFIC]

### Constraints & Requirements
- Must-haves: [NON_NEGOTIABLE_REQUIREMENTS]
- Nice-to-haves: [PREFERRED_OUTCOMES]
- Blockers: [CURRENT_OBSTACLES]
```

#### 3. **Tool Integration Strategy**
```markdown
## Effective Tool Orchestration

1. **First**: Use 'relevant_standards_tool' to establish baseline understanding
2. **Then**: Apply specific diagnostic or analysis tools  
3. **Finally**: Use 'documentation_tool' to capture decisions and outcomes

This creates a complete workflow that leverages your knowledge base effectively.
```

### Conversation Flow Patterns

#### Linear Workflow Pattern
```json
{
    "role": "user",
    "content": {
        "type": "text",
        "text": "Execute this step-by-step process:\n\n**Step 1**: Initial assessment using diagnostic tools\n**Step 2**: Problem analysis with relevant checklists  \n**Step 3**: Solution implementation with best practices\n**Step 4**: Validation and documentation\n\nLet's start with Step 1..."
    }
}
```

#### Branching Logic Pattern
```json
{
    "role": "user", 
    "content": {
        "type": "text",
        "text": "Help me choose the right approach based on my situation:\n\n**If** this is a new feature → Use 'feature_development_guide'\n**If** this is a bug fix → Use 'debugging_methodology'\n**If** this is a refactor → Use 'refactoring_checklist'\n\nMy situation: [DESCRIBE_YOUR_CASE]\n\nBased on this, which path should we take?"
    }
}
```

#### Iterative Refinement Pattern  
```json
{
    "role": "user",
    "content": {
        "type": "text",
        "text": "Let's iterate on this solution together:\n\n**Round 1**: Initial approach and quick validation\n**Round 2**: Refinement based on feedback and constraints\n**Round 3**: Final optimization and implementation planning\n\nI'll provide context, you'll suggest approaches, and we'll refine until we have the optimal solution.\n\nStarting context: [INITIAL_SITUATION]"
    }
}
```

---

## 🔧 Dynamic Prompt Patterns

### Environment-Aware Prompts

```json
{
    "id": "environment_aware_deployment",
    "title": "Environment-Aware Deployment Guide",
    "description": "Deployment guidance that adapts based on target environment and current system state.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text", 
                "text": "🚀 **Smart Deployment Assistant**\n\nI'll provide deployment guidance customized for your environment and current system state:\n\n## Environment Detection\nLet me gather information about your deployment context:\n\n### 🎯 **Target Environment**:\n- Environment type: [DEVELOPMENT/STAGING/PRODUCTION]\n- Infrastructure: [CLOUD_PROVIDER/ON_PREMISE/HYBRID]\n- Deployment method: [MANUAL/CI_CD/BLUE_GREEN/CANARY]\n\n### 📊 **Current System State** (I'll check automatically):\n- System health status\n- Current load and performance\n- Recent deployment history  \n- Active incidents or maintenance windows\n\n### 🔍 **Change Assessment**:\n- Change type: [FEATURE/HOTFIX/INFRASTRUCTURE/CONFIG]\n- Risk level: [LOW/MEDIUM/HIGH/CRITICAL]\n- Rollback complexity: [SIMPLE/MODERATE/COMPLEX]\n\n## Adaptive Guidance\nBased on this information, I'll provide:\n\n- ✅ **Environment-specific procedures** from our deployment playbooks\n- ⚠️ **Risk-adjusted checklists** based on change complexity\n- 🔄 **Rollback strategies** appropriate for your infrastructure\n- 📢 **Communication templates** for stakeholder notification\n- 📊 **Monitoring focuses** for post-deployment validation\n\nLet me start by using our deployment monitoring tools to assess current system state...\n\n**What's your target environment and the type of change you're deploying?**"
            }
        }
    ]
}
```

### Role-Based Customization

```json
{
    "id": "role_based_incident_response",
    "title": "Role-Based Incident Response Coordinator",
    "description": "Incident response guidance customized for different roles and responsibility levels.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "🚨 **Role-Based Incident Response**\n\nI'll provide incident response guidance tailored to your role and current situation:\n\n## Role Identification\n**What's your role in incident response?**\n\n### 👩‍💻 **Individual Contributor Roles**:\n- **Frontend Developer**: UI/UX issue investigation\n- **Backend Developer**: API and service debugging  \n- **DevOps Engineer**: Infrastructure and deployment issues\n- **QA Engineer**: Testing and validation procedures\n- **Data Engineer**: Data pipeline and analytics issues\n\n### 👨‍💼 **Leadership Roles**:\n- **Tech Lead**: Technical coordination and decision making\n- **Engineering Manager**: Resource allocation and communication\n- **Incident Commander**: Overall incident coordination\n- **On-Call Engineer**: First responder and escalation\n\n### 🏢 **Cross-Functional Roles**:\n- **Product Manager**: Business impact assessment\n- **Customer Success**: Customer communication\n- **Security**: Security incident coordination\n\n## Customized Response Plan\nBased on your role, I'll provide:\n\n- 🎯 **Role-specific action items** and immediate priorities\n- 📋 **Relevant diagnostic tools** for your domain\n- 📞 **Escalation procedures** appropriate to your authority level  \n- 📢 **Communication templates** for your stakeholders\n- 📊 **Metrics and dashboards** relevant to your responsibility\n\n## Current Incident Context\n- Incident severity: [P0/P1/P2/P3]\n- Time since detection: [DURATION]\n- Systems affected: [LIST_SYSTEMS]\n- Current responders: [WHO_IS_INVOLVED]\n\n**What's your role, and what's the current incident situation?**\n\nI'll start by using the appropriate diagnostic tools for your role..."
            }
        }
    ]
}
```

---

## 📊 Prompt Performance & Analytics

### Measuring Prompt Effectiveness

#### Usage Metrics to Track
- **Completion Rate**: How often users complete the full workflow
- **Success Outcomes**: Whether the prompt achieves its intended goal  
- **Time to Resolution**: How quickly users solve their problems
- **User Satisfaction**: Feedback on helpfulness and clarity
- **Return Usage**: How often users return to the same prompt

#### A/B Testing Prompt Variations

```json
// Version A: Detailed upfront information gathering
{
    "id": "detailed_onboarding_v1",
    "messages": [{
        "role": "user",
        "content": {
            "text": "Complete this detailed form first, then I'll provide customized guidance: [LONG_FORM]"
        }
    }]
}

// Version B: Progressive disclosure approach
{
    "id": "progressive_onboarding_v2", 
    "messages": [{
        "role": "user",
        "content": {
            "text": "Let's start with the basics and I'll ask follow-up questions as we go: [SIMPLE_START]"
        }
    }]
}
```

### Prompt Optimization Strategies

#### Iterative Improvement Process
1. **Collect Usage Data** - Track how prompts are used in practice
2. **Identify Pain Points** - Where do users get stuck or drop off?
3. **Test Variations** - A/B test different approaches
4. **Measure Impact** - Does the change improve outcomes?
5. **Scale Successful Patterns** - Apply learnings to other prompts

#### Common Optimization Areas
- **Information Gathering Order** - What to ask first vs. later
- **Instruction Clarity** - Reducing ambiguity and confusion
- **Tool Integration** - More effective use of knowledge base tools
- **Conversation Length** - Balancing thoroughness with usability
- **Error Recovery** - Handling unexpected user inputs gracefully

---

## 🎯 Real-World Prompt Examples

### Production-Ready Code Review Prompt

```json
{
    "id": "production_ready_code_review",
    "title": "Production-Ready Code Review Checklist",
    "description": "Comprehensive code review process for production-bound code with security, performance, and maintainability focus.",
    "messages": [
        {
            "role": "user",
            "content": {
                "type": "text",
                "text": "🔍 **Production-Ready Code Review Process**\n\nI'm reviewing code that's headed to production. Let's ensure it meets our highest standards:\n\n## Pre-Review Setup\n**Pull Request Information:**\n- Repository: [REPO_NAME]\n- Feature description: [WHAT_DOES_THIS_DO]\n- Risk assessment: [LOW/MEDIUM/HIGH]\n- Deployment timeline: [WHEN_WILL_THIS_GO_LIVE]\n\n## Multi-Dimensional Review Process\n\n### 🔒 **Security Review**\nFirst, let me use our security tools:\n1. Use 'security_code_scanner' to check for vulnerabilities\n2. Use 'authentication_patterns' tool for auth-related changes\n3. Use 'data_privacy_checklist' for data handling code\n\n### ⚡ **Performance Review**\n1. Use 'performance_patterns' tool for optimization guidelines\n2. Check database query efficiency\n3. Validate caching and resource usage\n4. Review algorithmic complexity\n\n### 🧪 **Quality & Testing**\n1. Use 'testing_standards' tool for test coverage requirements\n2. Verify edge case handling\n3. Check error handling and logging\n4. Validate API contract stability\n\n### 🏗️ **Architecture & Maintainability**\n1. Use 'architecture_patterns' tool for design consistency\n2. Review code organization and modularity\n3. Check documentation and comments\n4. Validate naming and conventions\n\n### 🚀 **Deployment Readiness**\n1. Use 'deployment_checklist' for production requirements\n2. Verify configuration management\n3. Check monitoring and alerting\n4. Review rollback procedures\n\n## Review Execution\nI'll guide you through each dimension systematically, providing specific feedback templates and escalation criteria.\n\n**Let's start: What type of code changes are we reviewing, and what's the risk level?**\n\nI'll begin by loading the appropriate security and quality tools..."
            }
        }
    ]
}
```

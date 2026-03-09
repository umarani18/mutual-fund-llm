# Analytical Modules Implementation Plan (2 Phases)

## Source Inputs
- Specification reviewed: `Analytical Modules Specification.docx` (extracted to `doc_content.txt`)
- Backend reviewed: `backend_aws/main.py`, `backend_aws/services/analytics_service.py`, `backend_aws/utils/deterministic_formulas.py`, `backend_aws/utils/compliance_logic.py`
- Frontend reviewed: `frontend/lib/api.js`, `frontend/hooks/useChat.js`, `frontend/app/assistant/compare/page.js`, `frontend/app/assistant/[schemeCode]/details/page.js`

## 1) Current Backend Implementation Status vs Spec

### Module A: Fund Comparison Module
Spec requires independent API and service (`/analytics/compare`) with period alignment + metric table.

Status: **Partially implemented (UI-driven, not module-driven)**
- Implemented:
  - Frontend compare view exists and compares multiple funds by calling per-fund metrics endpoint (`frontend/app/assistant/compare/page.js`).
  - Backend returns rich per-fund metrics from `/api/v1/fund-metrics/{scheme_code}` (`backend_aws/main.py:442`).
- Missing:
  - No dedicated comparison backend module/service structure (`comparison_service.py`, `metric_fetcher.py`, formatter).
  - No dedicated compare API (`POST /analytics/compare`).
  - Comparison logic is currently assembled in frontend, not deterministic backend service.

### Module B: Advanced Screening Module
Spec requires deterministic rule parser/filter engine with operators and API (`/analytics/screen`).

Status: **Partially implemented (chat flow only)**
- Implemented:
  - Chat agent supports numeric filtering and compliance stack during recommendation flow (`backend_aws/agents/mf_agent.py`, `backend_aws/utils/compliance_logic.py`).
  - Compliance modules include conflict checks, null filtering, AUM filtering, stable sort, etc. (`backend_aws/utils/compliance_logic.py:590`).
- Missing:
  - `AnalyticsService.run_advanced_screen()` is placeholder returning empty list (`backend_aws/services/analytics_service.py:109`).
  - No standalone screening API that frontend can call directly.
  - No explicit rule-parser contract matching spec payload (`rules[]`, operators `between`, etc.) exposed publicly.

### Module C: Rolling Return Analysis Module
Spec requires rolling return series API with mean + median over requested window.

Status: **Partially implemented (metrics present, module API missing)**
- Implemented:
  - Precomputed rolling metric (`rolling_return_1y_avg`) is exposed in fund metrics endpoint (`backend_aws/main.py:483`).
  - Formula helper exists (`calculate_rolling_returns`) in deterministic formulas (`backend_aws/utils/deterministic_formulas.py`).
- Missing:
  - No API endpoint for rolling return time-series output.
  - No response including `rolling_returns[]`, `mean_rolling_return`, `median_rolling_return` as spec defines.
  - `AnalyticsService` references `RollingEngine` but source file is absent in `backend_aws/analytics` (only `__init__.py` present).

### Module D: Risk Analytics Module
Spec requires standard deviation, Sharpe, max drawdown as deterministic service API.

Status: **Partially implemented**
- Implemented:
  - Risk metrics are available in stored master data and exposed via `/api/v1/fund-metrics` (`backend_aws/main.py:474-483`).
  - Deterministic formulas for std-dev, Sharpe, max drawdown, downside risk are present (`backend_aws/utils/deterministic_formulas.py`).
- Missing:
  - No dedicated risk analytics API (`POST /analytics/risk-metrics`).
  - `AnalyticsService.get_risk_profile()` exists but not wired to routes and imports missing engine source files (`backend_aws/services/analytics_service.py:12-17`).

### Module E: Benchmark Outperformance Module
Spec requires benchmark comparison with excess return and outperformance frequency.

Status: **Partially implemented / incomplete dependency chain**
- Implemented:
  - Alpha/Beta fields are exposed in fund metrics endpoint (`backend_aws/main.py:479-480`).
  - Benchmark mapping helpers/compliance attachment exist (`backend_aws/utils/deterministic_formulas.py`, `backend_aws/utils/compliance_logic.py:449`).
- Missing:
  - No standalone API for benchmark outperformance.
  - `AnalyticsService.get_benchmark_comparison()` is not routed and depends on benchmark engines that are not present as source files (`backend_aws/services/analytics_service.py:114+`).
  - Benchmark data service appears mock-oriented in current service path.

## 2) Additional Architecture Gaps Affecting Workflow

- Analytics engines are referenced but missing as source modules in `backend_aws/analytics/*` (only `__init__.py` files are present).
- `AnalyticsService` is currently unused by API routes (no integration in `main.py`).
- Frontend API base strategy is inconsistent:
  - Auth uses hardcoded production API URL (`frontend/lib/api.js:62-65`).
  - Chat/fund calls default to localhost base (`frontend/lib/api.js:15`, `67-97`).
- Current chat path uses alias endpoints (`/predict`, `/chats`) instead of canonical versioned endpoints (`/api/v1/*`) in frontend (`frontend/lib/api.js:68-90`).

## 3) Correct Target Workflow

### Data/Service Workflow
1. Data layer: NAV + master metrics + benchmark series.
2. Analytics Engine layer: deterministic module services (compare, screen, rolling, risk, benchmark).
3. Logic engine layer: chat agent orchestration uses analytics APIs/services (no duplicated math in agent).
4. API layer: stable versioned endpoints under `/api/v1/analytics/*`.
5. Frontend layer:
   - Chat UI uses chat endpoints only.
   - Compare/details/screener pages use analytics endpoints directly.

### API Contract (Target)
- `POST /api/v1/analytics/compare`
- `POST /api/v1/analytics/screen`
- `POST /api/v1/analytics/rolling-return`
- `POST /api/v1/analytics/risk-metrics`
- `POST /api/v1/analytics/benchmark-outperformance`

## 4) 2-Phase Implementation Plan

## Phase 1 (Foundation + API Enablement)
Goal: expose deterministic analytics APIs with minimal UI disruption.

### Backend Tasks
- Create missing analytics engine source files:
  - `backend_aws/analytics/comparison/comparison_service.py`
  - `backend_aws/analytics/screening/rule_parser.py`
  - `backend_aws/analytics/screening/filter_engine.py`
  - `backend_aws/analytics/rolling/rolling_engine.py`
  - `backend_aws/analytics/risk/volatility_engine.py`
  - `backend_aws/analytics/risk/sharpe_engine.py`
  - `backend_aws/analytics/risk/drawdown_engine.py`
  - `backend_aws/analytics/benchmark/outperformance_engine.py`
  - `backend_aws/analytics/benchmark/index_data_service.py`
- Make `AnalyticsService` executable by removing broken imports and pointing to real engine files.
- Add versioned analytics routes in `backend_aws/main.py` under `/api/v1/analytics/*`.
- Keep existing `/predict` and `/api/v1/fund-metrics` intact for backward compatibility.
- Add Pydantic request/response models for each analytics module.

### Frontend Tasks
- Add `analyticsApi` in `frontend/lib/api.js`.
- Keep compare/details pages operational on existing endpoint first; add optional feature flag to consume new analytics endpoints.
- Normalize API base handling via env config (`NEXT_PUBLIC_API_BASE_URL`) and remove hardcoded split behavior.

### QA/Acceptance (Phase 1)
- All 5 analytics endpoints return deterministic JSON for fixed input.
- No regression in assistant chat, compare page, details page.
- Contract tests for each analytics endpoint and one integration test from frontend service layer.

## Phase 2 (Workflow Convergence + Frontend Integration)
Goal: move business analytics out of ad-hoc/frontend/chat-only paths into unified analytics workflow.

### Backend Tasks
- Refactor agent to call analytics services for compare/screen/risk/rolling/benchmark instead of mixed inline logic.
- Implement advanced screening operator grammar fully (`>`, `<`, `>=`, `<=`, `=`, `between`) with strict validation.
- Implement benchmark outperformance with real benchmark time-series source (replace mock path).
- Add observability fields in responses (`calculation_window`, `data_points_used`, `as_of_date`).

### Frontend Tasks
- Create dedicated screening UI page consuming `POST /api/v1/analytics/screen`.
- Refactor compare page to call backend compare endpoint once instead of N per-fund requests when possible.
- Add rolling/risk/benchmark widgets in fund details page using new endpoints.
- Use canonical `/api/v1/*` routes consistently (aliases kept only as temporary fallback).

### QA/Acceptance (Phase 2)
- Chat and non-chat analytics paths produce consistent metrics for same fund and period.
- Compare page latency reduced (single compare request path).
- Screening UI supports rule builder + deterministic output reproducibility.
- End-to-end tests: login -> screen -> compare -> fund details analytics panels.

## 5) Suggested Execution Order (Concrete)
1. Restore analytics engine source files and wire `AnalyticsService`.
2. Ship analytics APIs with tests (Phase 1 backend complete).
3. Add frontend `analyticsApi` + env-based base URL standardization.
4. Incrementally migrate compare/details to new endpoints.
5. Refactor chat agent to use analytics services and remove duplicated math paths.
6. Add advanced screener UI + benchmark outperformance UI.

## 6) Risks and Mitigations
- Risk: metric mismatch between precomputed DB fields and on-demand analytics calculations.
  - Mitigation: include `calculation_mode` (`precomputed` vs `on_demand`) in responses and validate tolerance bounds.
- Risk: route fragmentation (`/predict` vs `/api/v1/suggest`).
  - Mitigation: adopt canonical routes in frontend; keep aliases deprecated with timeline.
- Risk: missing benchmark historical data source.
  - Mitigation: phase rollout with explicit `status: partial` until provider finalized.

## 7) Deliverables Checklist
- [ ] Analytics engine source modules added.
- [ ] `AnalyticsService` imports fixed and used by API routes.
- [ ] 5 analytics endpoints implemented under `/api/v1/analytics`.
- [ ] Frontend `analyticsApi` service added.
- [ ] Base URL configuration standardized across auth/chat/fund/analytics.
- [ ] Phase 1 and Phase 2 test suites passing.

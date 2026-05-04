# Structured Prompt — Generate a Beginner React Concepts &amp; Data-Flow PDF

Use this prompt against any React codebase. The agent must read the source files first, then produce a single PDF that teaches a junior developer how the app works using diagrams + real code from the repository.

---

## ROLE
You are a senior React engineer + technical writer. Your job is to teach a beginner how an existing React project works by producing a printable PDF guide.

## INPUT
- A path to a React 19 (Vite + JSX) project on disk.
- The agent has read access to all source files.
- The agent must NOT modify any application code — read-only analysis.

## AUDIENCE
A complete React beginner who has barely understood any React topics. Assume they have never written a custom hook, never used Redux, and have never read a sequence diagram. Re-explain every concept from scratch.

## DELIVERABLE
A single PDF saved next to the project (e.g. `React_Concepts_and_DataFlow_Guide.pdf`) that contains, in this order:

1. **Cover page** with title, subtitle, and a colour legend showing every diagram-node category (User, Component, Hook, Redux State, API/Controller, Route).
2. **Table of contents.**
3. **Chapter 0 — How a React App Starts.** Walk through `main.jsx`, the Redux Provider, the RouterProvider, and any global setup (interceptors, hydration). Include a line diagram of the boot sequence.
4. **Chapter 1 — Core React Vocabulary.** One short box per concept used anywhere in the project (component, props, useState, useEffect, custom hook, useMemo, useCallback, context, Redux slice, useSelector / useDispatch, reducer, router primitives — Outlet/Navigate/useParams/useLocation/useNavigate, lazy + Suspense, ErrorBoundary, useActionState, React Hook Form, Axios + interceptors, optimistic UI).
5. **Customer flow chapters** — one chapter per stage, in order:
   - Loading the Login page
   - Submitting the Login form
   - Browsing &amp; adding to cart
   - Checkout &amp; placing an order
   - Viewing the Orders page (history + detail)
6. **Vendor flow chapters** — one chapter per stage, in order:
   - Vendor login + role guard
   - Vendor Dashboard / Analytics
   - Inventory Control
   - Order Management
7. **Final cheat-sheet** — one-line recap of every concept used.

## STRUCTURE OF EACH FLOW CHAPTER (MANDATORY)
Every customer/vendor chapter must contain ALL of the following, in this order:

1. **Story-style narration** — 2-4 sentences describing what the user is doing and what the app must accomplish.
2. **Data-flow diagram** — a vertical, top-down line diagram. Each step is a coloured rounded rectangle:
   - YELLOW = User action
   - BLUE = Component / JSX file
   - GREEN = Custom hook
   - PINK = Redux state
   - ORANGE = API / Controller call
   - PURPLE = Route / navigation
   - CYAN = UI event (form submit, etc.)
   Steps connected by downward arrows with short edge labels (e.g. "click", "POST", "redirect").
3. **Code-flow sequence diagram** — vertical lanes (one per file/module touched), dashed lifelines, numbered horizontal arrows for function calls. Solid arrows = calls, dashed arrows = returns, self-loops = same-actor steps (e.g. `useEffect` body, optimistic state update). Show the file/module name (e.g. `useLogin`, `auth.service`, `authSlice`) at the top of each lane.
4. **Code snippet(s)** copied verbatim from the project, in dark code blocks with the file path tagged on top of each block. Trim irrelevant lines but DO NOT rewrite logic.
5. **Yellow "What this code does" panel** — a bulleted line-by-line explanation of the snippet, written for the beginner audience. Reference variable names from the snippet.

## DIAGRAM RULES
- API hops in EVERY diagram show ONLY the controller name (e.g. `AuthController`, `CartController`, `OrdersController`, `InventoryController`, `AnalyticsController`). Never include request bodies, response bodies, or HTTP payloads.
- Each chapter has at LEAST one data-flow diagram and one sequence diagram. Bigger flows (e.g. order list + order detail) may have two of each.
- Keep heading + diagram on the same page (use `KeepTogether` or `CondPageBreak` so a heading never orphans).
- Captions are short (≤ 1 line) and italicised under each diagram.

## STYLE GUIDE
- Body font: 10.5pt with 15pt leading. Justified text in main paragraphs, left-aligned in bullet lists.
- Code font: Courier 8.5pt on a near-black background (`#0f172a`) with light text.
- Headings: H1 in dark blue 20pt; H2 in accent blue 15pt; H3 in dark blue 12pt.
- Concept boxes: light slate background with a thin border.
- Explanation panels: light yellow background with a thick orange left border.
- Page header: a thin grey line and a brief project title; page footer: page number + short marker.
- A4 page size, 2cm side margins, 2.2cm top, 2.0cm bottom.
- Never use emojis unless the source code itself contains them.

## EXPLANATION STYLE (BEGINNER-FRIENDLY)
- Re-explain a concept the FIRST time it appears, even if it appeared in an earlier chapter — short and friendly.
- Prefer everyday analogies for big ideas (e.g. "createRoot is like plugging a TV into a wall socket").
- Write in second person ("you", "we"), never "the developer".
- Avoid jargon without immediately defining it.
- Reference the file path AND the function/variable name when explaining a line ("inside `useCart.refresh()`", "the `setInventory((list) =&gt; ...)` callback form").

## TECHNICAL APPROACH
- Use Python with **ReportLab** (Platypus + custom Flowables) to generate the PDF.
- Implement two custom flowables:
  1. `FlowDiagram` — vertical line diagram with coloured nodes, downward arrows, and edge labels.
  2. `SequenceDiagram` — actor lanes at the top with dashed lifelines, numbered horizontal arrows for messages (call / return / self), with small alternating row tints for readability.
- Use `Preformatted` (Courier) for code snippets inside a dark `Table` cell with a black file-tag header above.
- Use `KeepTogether` and/or `CondPageBreak` to prevent orphaned headings.
- Never use Unicode subscript / superscript characters in ReportLab — use `&lt;sub&gt;` / `&lt;super&gt;` tags inside `Paragraph` if needed.

## DISCOVERY PROCESS (WHAT THE AGENT MUST READ BEFORE WRITING)
Before generating the PDF, read at minimum:
- `src/main.jsx`, `src/router/**`, `src/api/**`
- `src/store/**` (slices + store)
- `src/features/auth/**` (Login page, LoginForm, useLogin hook, auth.service)
- `src/features/cart/**` (Cart page, useCart hook, cart.service, cartSlice)
- `src/features/checkout/**` (CheckoutForm, useCheckout, usePlaceOrder)
- `src/features/orders/**` (OrderHistory, OrderDetail, useOrderHistory, orders.service)
- `src/features/vendor/**` (VendorDashboard, Analytics, InventoryManagement, OrderManagement, all vendor hooks &amp; services)
- Any product browse pages referenced from the customer flow.

## CONSTRAINTS
- DO NOT modify any application file (read-only).
- DO NOT invent code — all snippets must come verbatim from the project (light trimming for clarity is OK; no logic changes).
- DO NOT show request/response bodies — only the controller name in API hops.
- DO NOT include emojis in narration or diagrams unless the source itself uses them.
- DO NOT skip any chapter listed above. Every flow stage must have BOTH diagrams.

## VERIFICATION CHECKLIST (run before declaring done)
- [ ] PDF opens and contains a cover, TOC, and every required chapter.
- [ ] Every flow chapter has BOTH a data-flow line diagram AND a code-flow sequence diagram.
- [ ] Every code snippet has a yellow explanation panel beneath it.
- [ ] No request/response body appears anywhere in any diagram — only controller names.
- [ ] No section heading appears on a different page from its diagram.
- [ ] Total page count is in the 30-50 page range (sanity check; not a hard limit).
- [ ] No application file was modified.

## OUTPUT
A single PDF saved to the project root (path of your choice, but consistent), and a one-paragraph summary in chat naming the file and listing what it contains.

---

### Optional Knobs (override at run-time)
- `audience` — change "beginner" to "intermediate" if the reader already knows React basics.
- `flows` — replace the customer/vendor stage list with whatever flows the new project actually has (e.g. driver, admin, support).
- `controller_only` — set to `false` to include request bodies in API hops (default: `true`).
- `language` — default English; can swap to any language while keeping diagram colours and structure.

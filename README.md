# Influenco

A two-sided marketplace connecting **influencers/creators** with **brands** for sponsored content collaborations. Brands post campaigns, search for creators, and send direct collaboration requests. Influencers build a public profile, browse and apply to campaigns, and respond to inbound requests. Once a match is made, brands formalize the collaboration as a **deal**, which can later be verified.

---

## Tech stack

- **Backend:** ASP.NET Core Web API (.NET), Entity Framework Core, SQL Server (LocalDB in dev)
- **Auth:** ASP.NET Core Identity + JWT bearer tokens, role-based (`Influencer`, `Brand`)
- **Frontend:** React + TypeScript, React Router, Axios

---

## Domain model

### Users & Profiles
- **AppUser** — ASP.NET Identity user (email, password, role claim: `Influencer` or `Brand`)
- **Influencer** — 1:1 with AppUser. Display name, handle, bio, avatar/cover images (with adjustable, saved cover-image vertical position), location, categories, verification flag, self-reported Instagram/TikTok stats (followers, avg views, story views), audience age range and top locations.
- **Brand** — 1:1 with AppUser. Company name, description, logo, website, industry.

### Campaigns & Applications
- **Campaign** — Owned by a Brand. Title, description, deliverables, budget (single number), application deadline, status (`Draft` / `OpenForApplications` / `Closed`), target niches, target platforms, minimum follower threshold, applicant count.
- **CampaignApplication** — An Influencer's application to a Campaign: pitch message, proposed rate, status (`Pending` / `Accepted` / `Rejected`), and a brand response message shown back to the influencer.
- **CollaborationRequest** — A Brand reaching out to a specific Influencer directly (optionally tied to a Campaign): deliverables, offered budget, timeline, message, status (`Pending` / `Accepted` / `Declined`).

### Deals
- **Deal** — Created by a Brand once an application or collaboration request is accepted. Title, deliverables, price, optional links back to the originating application/request, and an `IsVerified` flag the brand can toggle once the collaboration is confirmed. Deal counts surface on the influencer's public profile (clickable → modal with full deal history, each entry showing verified/pending status) and on the brand's own "View deals" page.

### Content
- **Post** — A simple update (text + up to 3 image URLs) attached to either a Brand or an Influencer profile, shown in a shared `PostFeed` component. Owner-only composer; visible to all visitors as a read-only feed.

### Reviews 
- Brands can leave a review on an influencer's profile; an "Average rating" stat and a reviews-list modal exist on the influencer preview page.

---

## Feature areas

### Public / logged-out
- **Home** — marketing landing page, full-bleed stats bar, "how it works"
- **Discover** — first 6 influencers shown publicly; sign-in-gated beyond that (modal prompt)
- **Browse campaigns** — all open campaigns, filterable by niche; brand name links to that brand's public profile; closed campaigns (past deadline) show a "Closed" badge and hide the Apply button; applying requires login

### Influencer
- **Profile edit/preview** — cover (with adjustable, savable vertical position) + avatar, bio, categories, Instagram/TikTok stats (self-reported, with a "last updated" transparency note), computed engagement rate (`avg views ÷ followers`) and total reach
- **Discover other influencers** (logged in) — click-through to full profiles, with location/category/follower filters
- **Browse & apply to campaigns** — pitch message + proposed rate
- **My applications** — track status + see the brand's response/rejection reason
- **Requests** (collaboration request inbox) — accept/decline direct brand outreach; unread-count badge polls every 30s
- **Deals** — clickable "Completed deals" stat opens a modal listing all deals, each showing verified/pending status
- **Posts** — "Add a post" section (owner) / "Portfolio" (visitors); Facebook-style composer with text + up to 3 image URLs
- **Profile ownership check** — edit/manage controls (not just "no `:id` in URL") are gated by comparing the logged-in user's email against the profile's email, so shared route components never leak owner-only controls to visitors

### Brand
- **Profile edit/preview** — logo, company info, "Go to website" link, About + stats (active campaigns, completed deals) laid out side-by-side, active campaigns list, posts section — all following the same owner/visitor split as the influencer profile
- **Campaign CRUD** — create/edit/delete, list view with status + applicant counts
- **Review applicants** — side-by-side applicant cards, accept/reject with an optional message to the creator; toggle to a second view showing directly-requested influencers for that campaign
- **Send collaboration requests** — modal with a campaign dropdown (active campaigns only), deliverable checkboxes, budget, timeline, message
- **Create deals** — triggered from an accepted application or accepted collaboration request; pre-fills influencer, campaign, deliverables, and price from the source; can later mark a deal "Verified"
- **View deals** — full list of the brand's created deals
- **Active Campaigns card** — branches on ownership: owner sees a private, authenticated "my campaigns" view with Manage/Create actions; visitors see a public, read-only list scoped to that specific brand via a separate public endpoint

---

## API surface (by controller)

| Controller | Route prefix | Notes |
|---|---|---|
| `InfluencerController` | `/api/influencer` | Own profile CRUD; `discover` and `discover/{id}` public/any-auth |
| `BrandController` | `/api/brand` | Own profile CRUD (Brand-only) |
| `PublicBrandController` | `/api/brand-profile` | Public brand lookup + public active campaigns (any authenticated role) |
| `DiscoverController` | `/api/discover` | Paginated, filterable influencer discovery |
| `CampaignController` | `/api/campaigns` | Brand-only CRUD, plus `/applicants` and `/requested-influencers` sub-resources |
| `BrowseCampaignsController` | `/api/browse-campaigns` | Public browse (anonymous-friendly), Influencer-only apply/my-applications |
| `CollaborationRequestController` | `/api/collaboration-requests` | Brand sends/lists own-campaign requests; Influencer views/responds to inbound requests; pending-count endpoint |
| `DealController` | `/api/deals` | Brand-only create; any-auth read by influencer; Brand-only "my-deals" and verify |
| `PostController` | `/api/posts` | Create (owner), list by influencer/brand id |

Role checks are applied at the **method** level wherever a controller must serve more than one role — a class-level `[Authorize(Roles = "X")]` combines with (never overrides) a method-level attribute, so shared controllers avoid class-level restrictions in favor of per-endpoint ones.

---

## Local setup

### Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
Connection string lives in `appsettings.Development.json`. Uses SQL Server LocalDB by default — browse tables via SQL Server Object Explorer in Visual Studio (View → SQL Server Object Explorer).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Requires a `VITE_BASE_API_URL` environment variable pointing at the backend (see `axios/axios.ts`).

---
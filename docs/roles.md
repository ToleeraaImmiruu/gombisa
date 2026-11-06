# Roles in Gombisa

Update: every logged-in person (Member) can post. An admin approves each post. The "contributor" role is no longer needed.


| | Visitor | Customer | Contributor | Admin |
|---|:-:|:-:|:-:|:-:|
| Browse shop, games, events | yes | yes | yes | yes |
| Buy and see own orders | | yes | yes | yes |
| Ask to become a contributor | | yes | | |
| Add foods, clothes, games, events | | | yes (reviewed) | yes (published at once) |
| Edit / delete own items | | | yes | yes |
| Edit / delete anyone's items | | | | yes |
| Approve or reject submitted items | | | | yes |
| Change a person's role | | | | yes |
| Delete a person | | | | yes |
| See all orders and change their status | | | | yes |

## How content moves
draft -> pending (submitted) -> published (approved)  or  rejected (with a note)
Editing a published item by a contributor sends it back to "pending".

## Where each rule is enforced (never only in the browser)
- Database (supabase/migrations/006_roles_content.sql): Row Level Security policies and a trigger
  that forces contributor items to draft/pending, locks the owner, and blocks self-featuring.
- Backend (backend/src/routes/admin.routes.js): role changes and deleting people, admins only,
  using the service-role key that never reaches the browser.
- Frontend (ProtectedRoute): only hides pages. It is a convenience, not security.

## Not built yet
- Paying contributors: customers pay Gombisa through Chapa. Payouts to contributors are manual until
  you add Chapa split payments/subaccounts.
- Contributors seeing the orders for their own products and delivery addresses.
- Suspending (instead of deleting) a person.

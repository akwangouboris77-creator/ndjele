# Security Specification for Maraude Solution

## Data Invariants
1. A Driver profile must be linked to a valid authenticated user.
2. A Ride request must have a valid requester (user).
3. Professional profiles (doctors, lawyers, etc.) must be publicly readable but only writable by authenticated professionals or admins.
4. Timestamps (createdAt, updatedAt) must be server-generated.
5. User roles cannot be modified by the user themselves after creation.

## The Dirty Dozen Payloads (Target: DENY)
1. Creating a driver profile for another user: `{ userId: "victim_id", ... }` by user "attacker_id".
2. Updating `isVerified` field on a driver profile by the driver himself.
3. Deleting someone else's ride request.
4. Injecting a 2MB base64 string into a `firstName` field.
5. Setting `createdAt` to a date in the past.
6. Updating a ride's `price` after it has been accepted.
7. Creating a user with `role: "admin"`.
8. Listing all users without being an admin.
9. Writing to a professional collection without authentication.
10. Spoofing `userId` in a ride request.
11. Bypassing size limits on `licensePlate`.
12. Updating `email` field without verification.

## Test Strategy
Verified via manual audit and ESLint.

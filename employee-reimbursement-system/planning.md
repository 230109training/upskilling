# Planning

## Requirements
1. Users should be able to register (defaulting as an employee) and log in
2. Employees should be able to view their own reimbursements and also filter reimbursements by status
3. Employees should be able to submit reimbursements
4. Finance Managers should be able to view all reimbursements and also filter reimbursements by status
5. Finance Managers should be able to approve/deny reimbursements
    - If reimbursement is already approved or denied, then we should not be able to update the status
    - pending -> approved
    - pending -> denied
    - approved -> denied (not allowed)
    - denied -> approved (not allowed)
    - approved -> pending (not allowed)
    - deneid -> pending (not allowed)

## Data Modelling
Two tables

1. users
- username (partition key)
    - no sort key
- password
- role

2. reimbursements
- reimbursement_id (partition key)
    - no sort key
- amount
- description
- status
- submitter
    - Used to refer to a user item in the users table
    - Not really a foreign key, since there is no concept of FK in DynamoDB
- Global Secondary Indices
    - status-index
        - status (partition key)
    - submitter-index
        - submitter (partition key)

## DAO Operations
1. addUser(username, password)
    - role will default to "employee"
2. getUserByUsername(username)
3. getAllReimbursementsByUser(submitter)
    - getAllPendingReimbursementsByUser(submitter)
    - ...
4. createReimbursement(amount, description, submitter)
    - status will default to "pending"
    - reimbursement_id will be automatically generated using a UUID algorithm
5. getAllReimbursements()
    - getAllPendingReimbursements()
    - ...
6. updateReimbursementStatus(reimbursement_id, status)

## API endpoints
1. Register
    - `POST /users`
2. Login
    - `POST /login`
3. Viewing reimbursements (employee and finance_manager)
    - `GET /reimbursements`
        - For employees, only focus on their own reimbursements
        - For finance managers, focus on all
    - Optional query parameters
        - ?status=pending
        - ?status=denied
        - ?status=approved
4. Submit reimbursements
    - `POST /reimbursements`
5. Approve/deny reimbursements
    - `PATCH /reimbursements/:id/status`
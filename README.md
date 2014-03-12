tutorme-node
============

The tutorme-node repository contains the server side code backend for the mobile app. It is written using NodeJS, Express, and all the other bits and pieces that come with these frameworks.

## API

The backend uses a simple RESTful API to interact with the server.

### 1. Login

#### 1.1 Summary

<table>
  <tr>
    <td>
      URL
    </td>
    <td>
      <code>/login</code>
    </td>
  </tr>
  <tr>
    <td>
      Method
    </td>
    <td>
      <code>POST</code>
    </td>
  </tr>
  <tr>
    <td>
      Version
    </td>
    <td>
      1
    </td>
  </tr>
  <tr>
    <td>
      Permission
    </td>
    <td>
      All
    </td>
  </tr>
</table>

#### 1.2 Description

API call to authenticate against the system.

#### 1.3 Arguments

<table>
  <tr>
    <th>
      Parameter
    </th>
    <th>
      Description
    </th>
    <th>
      Required
    </th>
  </tr>
  <tr>
    <td>
      <code>email</code>
    </td>
    <td>
      Email of the user.
    </td>
    <td>
      Required
    </td>
  </tr>
  <tr>
    <td>
      <code>password</code>
    </td>
    <td>
      Password of the user.
    </td>
    <td>
      Required
    </td>
  </tr>
</table>

#### 1.4 Response

<table>
  <tr>
    <th>
      Parameter
    </th>
    <th>
      Description
    </th>
  </tr>
  <tr>
    <td>
      <code>status</code>
    </td>
    <td>
      Result of the request (SUCCESS, ERROR, or NOT_IMPLEMENTED).
    </td>
  </tr>
  <tr>
    <td>
      <code>token</code>
    </td>
    <td>
      Authentication token to be included in every subsequent API request. Included on SUCCESS.
    </td>
  </tr>
  <tr>
    <td>
      <code>message</code>
    </td>
    <td>
      Explicit error message that occurred server side. Included on ERROR.
    </td>
  </tr>
</table>

#### 1.5 Example

Request Body

```javascript
{
  "email": "user@example.com",
  "password": "examplePassword"
}
```

Response Body

```javascript
{
  "status": "SUCCESS",
  "token": "really long string"
}
```

### 2. Logout

#### 1.1 Summary

<table>
  <tr>
    <td>
      URL
    </td>
    <td>
      <code>/api/logout</code>
    </td>
  </tr>
  <tr>
    <td>
      Method
    </td>
    <td>
      <code>POST</code>
    </td>
  </tr>
  <tr>
    <td>
      Version
    </td>
    <td>
      1
    </td>
  </tr>
  <tr>
    <td>
      Permission
    </td>
    <td>
      API
    </td>
  </tr>
</table>

#### 2.2 Description

API call to log out of the system.

#### 2.3 Arguments

<table>
  <tr>
    <th>
      Parameter
    </th>
    <th>
      Description
    </th>
    <th>
      Required
    </th>
  </tr>
  <tr>
    <td>
      <code>email</code>
    </td>
    <td>
      Email of the user.
    </td>
    <td>
      Required
    </td>
  </tr>
  <tr>
    <td>
      <code>token</code>
    </td>
    <td>
      Temporary authentication token.
    </td>
    <td>
      Required
    </td>
  </tr>
</table>

#### 2.4 Response

<table>
  <tr>
    <th>
      Parameter
    </th>
    <th>
      Description
    </th>
  </tr>
  <tr>
    <td>
      <code>status</code>
    </td>
    <td>
      Result of the request (SUCCESS, ERROR, or NOT_IMPLEMENTED).
    </td>
  </tr>
  <tr>
    <td>
      <code>message</code>
    </td>
    <td>
      Explicit error message that occurred server side. Included on ERROR.
    </td>
  </tr>
</table>

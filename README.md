**Todo List**
1. Make the Login, Sign up, and Landing page inaccessible for authenticated users (priority)
2. The JWT tokens should not be valid after the user logs out (least priority)
3. Refactor the front end of handling refreshed access tokens (least priority) 
4. After the user logs out and logs in again, they should remain in the same page prior to logging out (least priority)

# User Authentication Documentation

### User Login
When the user logs in, the first thing that will happen is that the server checks if there is an existing user in the database with the username/email.
```typescript
const query = 'SELECT Id, Hash FROM Users WHERE UserName = ? OR Email = ? ;';
    const [ results ] = await pool.query(query, [req.body.userName, req.body.email]); 
    const data: User[] = JSON.parse(JSON.stringify(results));
   
    const passwordInput = req.body.password;
    
    
    
    if (data.length === 0 || data[0] === undefined) {
        res.status(404);
        res.send("User not found");
        return;
    }
```

If there is a user with the username/email, the server will check if the password from the input field matches with the stored hash password using [bcrypt](https://www.npmjs.com/package/bcrypt).
```typescript
const passwordDB = data[0].Hash;
        if ( await bcrypt.compare(passwordInput, passwordDB) ) {

           // Creation of jwt tokens

        } else {
            res.send("Wrong password. Try again.")
        }
```

If the user credentials are correct, it will generate a jwt access token and refresh token and send the two as an [HttpOnly cookie](https://owasp.org/www-community/HttpOnly) to prevent [XSS](https://portswigger.net/web-security/cross-site-scripting) attacks.
```typescript
 const user = { sub: data[0].Id } // jwt user payload
            const accessToken = generateAccessToken<UserPayload>(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken);

            // we need the 'secure' attribute set to 'true' to only use the cookies with HTTPS only
            res.cookie('jwt_access_token', accessToken, { httpOnly: true, sameSite: 'strict' })
            // also send the refresh token here
```



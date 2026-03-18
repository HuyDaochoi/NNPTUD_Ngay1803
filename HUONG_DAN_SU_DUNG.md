## Hướng Dẫn Sử Dụng API

### 1. SETUP BAN ĐẦU

**Chạy MongoDB**: Terminal 1
```powershell
mongod --dbpath D:\NNPTUD_Ngay1803\NNPTUD-S4\data\db
```

**Chạy Node.js**: Terminal 2
```powershell
cd D:\NNPTUD_Ngay1803\NNPTUD-S4
npm start
```

---

### 2. TEST TRÊN POSTMAN

#### A. REGISTER - Tạo tài khoản mới
```
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "username": "user1",
  "password": "Pass@123456",
  "email": "user1@gmail.com"
}
```

**Response**:
```json
{
  "_id": "...",
  "username": "user1",
  "email": "user1@gmail.com",
  ...
}
```

---

#### B. LOGIN - Đăng nhập
```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "username": "user1",
  "password": "Pass@123456"
}
```

**Response**: JWT Token (RS256 signed)
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjQyYjc4ZjI3OWI3OTBjMmM2YzdhYiIsImlhdCI6MTcxMDczNTAwMiwiZXhwIjoxNzEwNzM4NjAyfQ.jR0e4...
```

💡 **Lưu ý**: Token này được ký bằng **RS256** (RSA 2048-bit) thay vì HS256 cũ

---

#### C. GET /ME - Lấy thông tin user hiện tại
```
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer <token_từ_login>
```

**Response**:
```json
{
  "_id": "...",
  "username": "user1",
  "email": "user1@gmail.com",
  "fullName": "",
  ...
}
```

---

#### D. CHANGE PASSWORD - Đổi mật khẩu (YÊU CẦU ĐĂNG NHẬP)
```
POST http://localhost:3000/api/v1/auth/changepassword
Authorization: Bearer <token_từ_login>
Content-Type: application/json

{
  "oldpassword": "Pass@123456",
  "newpassword": "NewPass@789012"
}
```

**Validation**:
- oldpassword: Không được để trống
- newpassword: Phải có ít nhất 8 ký tự, bao gồm:
  - 1 ký tự đặc biệt (!@#$%^&* v.v)
  - 1 ký tự in hoa (A-Z)
  - 1 ký tự thường (a-z)
  - 1 con số (0-9)

**Response** (nếu thành công):
```json
{
  "message": "Password changed successfully"
}
```

**Response** (nếu oldpassword sai):
```json
{
  "message": "Old password is incorrect"
}
```

---

### 3. JWT TOKEN CHANGES (RS256)

#### Cũ (HS256):
```javascript
jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' })
```

#### Mới (RS256):
```javascript
jwt.sign({ id: user._id }, privateKey, { 
  algorithm: 'RS256',
  expiresIn: '1h' 
})
```

**RSA Keys**:
- **Private Key**: `keys/private.pem` (2048 bits) - Dùng để ký token
- **Public Key**: `keys/public.pem` (2048 bits) - Dùng để verify token

---

### 4. VALIDATE RULES

**Password Validation**:
- Tối thiểu 8 ký tự
- Ít nhất 1 ký tự đặc biệt
- Ít nhất 1 ký tự in hoa
- Ít nhất 1 ký tự thường
- Ít nhất 1 con số

**Username**:
- Chỉ chứa chữ cái và số (alphanumeric)

**Email**:
- Phải là định dạng email hợp lệ

---

### 5. CẤU TRÚC THỬMUC

```
NNPTUD-S4/
├── app.js
├── package.json
├── bin/
│   └── www
├── routes/
│   └── auth.js (CÓ changepassword API MỚI)
├── controllers/
│   └── users.js (CÓ ChangePassword function MỚI)
├── schemas/
│   └── users.js
├── utils/
│   ├── authHandler.js (CẬP NHẬT RS256)
│   ├── validateHandler.js (THÊM ChangePasswordValidator)
│   └── generateKeys.js (SCRIPT TẠO KEYS)
├── keys/
│   ├── private.pem (ĐÃ TẠO ✓)
│   └── public.pem (ĐÃ TẠO ✓)
└── data/
    └── db/ (MongoDB data)
```

---

### 6. MỤC ĐÍCH CHUYỂN SANG RS256

✅ **Bảo mật cao hơn**: Public key có thể chia sẻ công khai, private key giữ kín  
✅ **Verify token trên nhiều server**: Mỗi server có public key, không cần chia sẻ secret  
✅ **Tuân chuẩn OAuth2**: RS256 là chuẩn trong OAuth2 v2.0  
✅ **Mạnh hơn HS256**: RSA 2048-bit an toàn hơn chuỗi secret text  

---

**Hoàn thành!** 🎉

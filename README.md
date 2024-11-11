# Proses CRUD Mahasiswa + Auth Login

Nama: Brian Cahya Purnama

NIM: H1D022009

Shift Lama: C

Shift Baru: D

## Screenshot dan Penjelasan

### 1. Antarmuka Login dan Proses Autentikasi
| Halaman Login | Validasi Kesalahan |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/942c4299-f865-4115-abb7-92e11eae15de" width="300"> | <img src="https://github.com/user-attachments/assets/503f3fa8-90b4-453b-a549-354913a02ac8" width="300"> |
- **Komponen Tampilan**
  - Menggunakan ion-header dengan judul "Login" yang responsif
  - Form login dengan komponen ion-item untuk input yang terstruktur
  - Field username menggunakan ion-input type="text"
  - Field password menggunakan ion-input type="password" untuk keamanan
  - Tombol login menggunakan ion-button dengan warna primary dan mode expand="block"
- **Validasi Input**
  ```typescript
  if (this.username != null && this.password != null) {
    // Proses login
  } else {
    this.authService.notifikasi('Username atau Password Tidak Boleh Kosong');
  }
  ```
- **Mekanisme Login:** Data login dikirim ke server melalui AuthenticationService
menggunakan metode POST dengan endpoint 'login.php',
menerima response berupa token dan username jika berhasil, dan
menyimpan data autentikasi menggunakan saveData()

- **Penanganan Response**
    - Sukses: Menyimpan token dan username, mengosongkan form, dan redirect ke halaman      mahasiswa
    - Gagal: Menampilkan pesan error spesifik, handling error koneksi server, validasi kredensial

- **Jenis Notifikasi**
    - Username/password kosong
    - Kredensial tidak valid
    - Masalah koneksi server / laragon | xampp belum nyala

### 2. Tampilan Data (Read)
| Tampil Data |
|:---:|
| <img src="https://github.com/user-attachments/assets/18bddfe1-7900-48de-8d9f-717916529b57" width="500"> |

- **Struktur**

    - Header dengan icon person dan judul "Data Mahasiswa"
    - Informasi user yang sedang login
    - Daftar mahasiswa dalam format card
    - Tombol aksi (edit & hapus) untuk setiap data
    - Menggunakan metode GET dengan endpoint 'tampil.php'
- **Implementasi Get Data**
    ```typescript
    getMahasiswa() {
      this.api.tampil('tampil.php').subscribe({
        next: (res: any) => {
          this.dataMahasiswa = res.filter((item: any) => 
            item && item.nama && item.jurusan && 
            item.nama.trim() !== '' && item.jurusan.trim() !== ''
          );
        },
        error: (err: any) => {
          // Error handling
        },
      });
    }
    ```
### 3. Penambahan Data (Create)

| Tambah Data | Alert Berhasil |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/62848ef1-5beb-4156-b706-e31a0b7b9c9a" width="400"> | <img src="https://github.com/user-attachments/assets/b68783f5-636b-401e-aa9a-5a1fb7e8d837" width="400"> |

- **Modal Tambah**
    - Implementasi ion-modal dengan template terstruktur
    - Form input dengan validasi
    - Tombol close dan submit
    - Menggunakan metode POST dengan endpoint 'tambah.php'
- **Proses Tambah Data**
    ```typescript
    async tambahMahasiswa() {
      if (this.namaMahasiswa != '' && this.jurusan != '') {
        let data = {
          nama: this.namaMahasiswa,
          jurusan: this.jurusan,
        }
        // Proses pengiriman data ke server
      }
    }
    ```
- **Validasi & Feedback**

    - Validasi field kosong
    - Alert konfirmasi keberhasilan
    - Reset form setelah berhasil
    - Refresh data otomatis

### 4. Edit Data (Update)

| Edit Data | Alert Berhasil |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/57fa5284-f19a-48c4-9fbd-2624da67c070" width="400"> | <img src="https://github.com/user-attachments/assets/64797c85-d0f7-4544-b7c5-eaa332b9b9e6" width="400"> |
- **Pengambilan Data Otomatis**
  - Data mahasiswa yang akan diedit akan terisi otomatis di form
  - Menggunakan metode PUT dengan endpoint 'edit.php'
  - Menggunakan fungsi ambilMahasiswa() untuk mengambil data dari server:
    ```typescript
    ambilMahasiswa(id: any) {
      this.api.lihat(id, 'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          let mahasiswa = hasil;
          this.id = mahasiswa.id;
          this.namaMahasiswa = mahasiswa.nama;
          this.jurusan = mahasiswa.jurusan;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
    }
    ```
  - Field nama dan jurusan akan langsung terisi dengan data yang sudah ada
  
- **Form dengan Validasi**
  - Memastikan field nama dan jurusan tidak boleh kosong
  - Menggunakan ion-input dengan label yang jelas
  - Menampilkan pesan error jika validasi gagal
  - Contoh validasi:
    ```typescript
    if (this.namaMahasiswa != '' && this.jurusan != '') {
      // Proses edit data
    } else {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Nama dan jurusan harus diisi',
        buttons: ['OK']
      });
    }
    ```
- **Penanganan Perubahan Data**
  - Menyimpan perubahan saat tombol "Edit Mahasiswa" ditekan
  - Mengirim data yang diperbarui ke server
  - Menampilkan alert sukses jika berhasil:
    ```typescript
    const alert = await this.alertController.create({
      header: 'Sukses',
      message: `Data mahasiswa ${this.namaMahasiswa} berhasil diubah`,
      buttons: ['OK']
    });
    ```
  - Menutup modal secara otomatis setelah edit berhasil
  - Memperbarui tampilan data di halaman utama

### 5. Hapus Data (Delete)
| Alert Hapus Data | Hapus Berhasil |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/b2179ed4-d8d0-4f27-b186-8dbed20aee11" width="400"> | <img src="https://github.com/user-attachments/assets/339a8abe-c735-46a6-bf3f-662df5561e1c" width="400"> |
- **Konfirmasi Penghapusan**
    ```typescript
    async konfirmasiHapus(id: any) {
      const alert = await this.alertController.create({
        header: 'Konfirmasi',
        message: 'Apakah anda yakin ingin menghapus data ini?',
        buttons: [
          {
            text: 'Tidak',
            role: 'cancel'
          }, {
            text: 'Ya',
            handler: () => {
              this.hapusMahasiswa(id);
            }
          }
        ]
      });
    }
    ```
- **Menghapus data langsung dari database melalui API**
    ```typescript
    hapusMahasiswa(id: any) {
      this.api.hapus(id, 'hapus.php?id=').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.getMahasiswa(); // Refresh data setelah hapus
          console.log('berhasil hapus data');
        },
        error: (error: any) => {
          console.log('gagal');
        }
      })
    }
    ```
- **Proses Penghapusan Data**
    - Dialog konfirmasi dua langkah (Ya/Tidak)
    - Mencegah penghapusan tidak sengaja
    - Menggunakan metode DELETE dengan endpoint 'hapus.php'
    - Refresh otomatis daftar mahasiswa setelah penghapusan
    - Memastikan data yang ditampilkan selalu yang terbaru

### 6. Fitur Logout
| Logout -> Back to Login |
|:---:|
| <img src="https://github.com/user-attachments/assets/20e7f0cc-2f51-426b-9458-9547cf8e90a9" width="500"> |

- **Implementasi Logout**
    ```typescript
    logout() {
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }
    ```
- **Proses Logout**
    - Menghapus token autentikasi
    - Membersihkan data sesi
    - Redirect ke halaman login
    - Reset state aplikasi

## Database
#### Tabel Mahasiswa
```sql
CREATE TABLE mahasiswa (
  id int PRIMARY KEY AUTO_INCREMENT,
  nama varchar(255) NOT NULL,
  jurusan varchar(255) NOT NULL
);
```
#### Tabel User
```sql
CREATE TABLE user (
    username varchar(100) NOT NULL,
    password varchar(255) NOT NULL
);
INSERT INTO user (username, password) VALUES ('tes', MD5('tes123'));
```

## Keamanan Aplikasi
1. **Autentikasi**
    * Implementasi token-based authentication
    * Validasi token untuk setiap request
    * Penanganan session timeout
    * Enkripsi password
2. **Route Guard**
    * Proteksi rute menggunakan Angular Guard
    * Validasi token untuk akses halaman
    * Redirect otomatis ke login jika tidak terautentikasi
3. **Error Handling**
    * Penanganan error koneksi
    * Validasi input user
    * Feedback yang informatif
    * Log error untuk debugging

## Demo
<img src="demo.gif" width="800">

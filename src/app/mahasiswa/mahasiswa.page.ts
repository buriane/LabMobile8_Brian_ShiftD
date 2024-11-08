import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;
  modalTambah: any;
  id: any;
  nama: any;
  jurusan: any;
  modalEdit: any;

  resetModal() {
    this.id = null;
    this.nama = '';
    this.jurusan = '';
  }
  
  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilMahasiswa(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  constructor(private api: ApiService, private modal: ModalController, private alertController: AlertController) { }

  ngOnInit() {
    this.getMahasiswa();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  async konfirmasiHapus(id: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah anda yakin ingin menghapus data ini?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Hapus dibatalkan');
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.hapusMahasiswa(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async tambahMahasiswa() {
    if (this.nama != '' && this.jurusan != '') {
      let data = {
        nama: this.nama,
        jurusan: this.jurusan,
      }
      this.api.tambah(data, 'tambah.php')
        .subscribe({
          next: async (hasil: any) => {
            this.resetModal();
            console.log('berhasil tambah mahasiswa');
            this.getMahasiswa();
            this.modalTambah = false;
            this.modal.dismiss();

            const alert = await this.alertController.create({
              header: 'Sukses',
              message: `Data mahasiswa ${this.nama} berhasil ditambahkan`,
              buttons: ['OK']
            });
  
            await alert.present();
          },
          error: async (err: any) => {
            console.log('gagal tambah mahasiswa');

            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Gagal menambahkan data mahasiswa',
              buttons: ['OK']
            });
  
            await alert.present();
          }
        })
    } else {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Nama dan jurusan harus diisi',
        buttons: ['OK']
      });
  
      await alert.present();
      console.log('gagal tambah mahasiswa karena masih ada data yg kosong');
    }
  }

  hapusMahasiswa(id: any) {
    this.api.hapus(id,
      'hapus.php?id=').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.getMahasiswa();
          console.log('berhasil hapus data');
        },
        error: (error: any) => {
          console.log('gagal');
        }
      })
  }

  ambilMahasiswa(id: any) {
    this.api.lihat(id,
      'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let mahasiswa = hasil;
          this.id = mahasiswa.id;
          this.nama = mahasiswa.nama;
          this.jurusan = mahasiswa.jurusan;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
  }

  async editMahasiswa() {
    if (this.nama != '' && this.jurusan != '') {
      let data = {
        id: this.id,
        nama: this.nama,
        jurusan: this.jurusan
      }
      this.api.edit(data, 'edit.php')
        .subscribe({
          next: async (hasil: any) => {
            console.log(hasil);
            this.resetModal();
            this.getMahasiswa();
            console.log('berhasil edit Mahasiswa');
            this.modalEdit = false;
            this.modal.dismiss();
            
            const alert = await this.alertController.create({
              header: 'Sukses',
              message: `Data mahasiswa ${this.nama} berhasil diubah`,
              buttons: ['OK']
            });
  
            await alert.present();
          },
          error: async (err: any) => {
            console.log('gagal edit Mahasiswa');
            
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Gagal mengubah data mahasiswa',
              buttons: ['OK']
            });
  
            await alert.present();
          }
        })
    } else {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Nama dan jurusan harus diisi',
        buttons: ['OK']
      });
  
      await alert.present();
      console.log('gagal edit mahasiswa karena masih ada data yg kosong');
    }
  }

}
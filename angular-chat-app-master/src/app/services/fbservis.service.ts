import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { Gorev } from '../models/Gorev';
import { Ilan } from '../models/Ilan';
import { Kategori } from '../models/Kategori';

@Injectable({
  providedIn: 'root'
})
export class FbservisService {
  aktifUye = authState(this.auth);
  
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) { }

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }
 
  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<User>;
      })
    );
  }
  //Gorev Başla//
  GorevListele() {
    var ref = collection(this.fs, "Gorevler");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('uid', '==', user?.uid)
        );
        return collectionData(myQuery, { idField: 'gorevId' }) as Observable<Gorev[]>;
      })
    );
  }
  GorevEkle(gorev: Gorev) {
    var ref = collection(this.fs, "Gorevler");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          baslik: gorev.baslik,
          aciklama: gorev.aciklama,
          tamam: gorev.tamam,
          uid: user?.uid
        })
      ),
      map((ref) => ref.id)
    );
  }
  GorevDuzenle(gorev: Gorev) {
    var ref = doc(this.fs, "Gorevler/" + gorev.gorevId);
    return updateDoc(ref, { ...gorev });
  }
  GorevSil(gorev: Gorev) {
    var ref = doc(this.fs, "Gorevler/" + gorev.gorevId);
    return deleteDoc(ref);
  }

  IlanListele() {
    var ref = collection(this.fs, "Ilanlar");
    return collectionData(ref, { idField: 'ilanid' }) as Observable<Ilan[]>;
  }
  IlanListeleByKatId(katId: string) {
    var ref = collection(this.fs, "Ilanlar");
    const myQuery = query(ref, where("katid", "==", katId));
    return collectionData(myQuery, { idField: "ilanid" }) as Observable<Ilan[]>
  }
  IlanEkle(ilan: Ilan) {
    var ref = collection(this.fs, "Ilanlar");
    return addDoc(ref, ilan);
  }
  IlanDuzenle(ilan: Ilan) {
    var ref = doc(this.fs, "Ilanlar/" + ilan.ilanid);
    return updateDoc(ref, { ...ilan });
  }
  IlanSil(ilan: Ilan) {
    var ref = doc(this.fs, "Ilanlar/" + ilan.ilanid);
    return deleteDoc(ref);
  }
  //İlan Bitiş//
  // Kategori servis//
  KategoriListele() {
    var ref = collection(this.fs, "Kategoriler");
    return collectionData(ref, { idField: 'katId' }) as Observable<Kategori[]>;
  }
  KategoriEkle(kategori: Kategori) {
    var ref = collection(this.fs, "Kategoriler");
    return addDoc(ref, kategori);
  }
  KategoriDuzenle(kategori: Kategori) {
    var ref = doc(this.fs, "Kategoriler/" + kategori.katId);
    return updateDoc(ref, { ...kategori });
  }
  KategoriSil(kategori: Kategori) {
    var ref = doc(this.fs, "Kategoriler/" + kategori.katId);
    return deleteDoc(ref);
  }

  // Kategori servis bitiş//


  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
}
-- Tabela: Użytkownik
CREATE TABLE Uzytkownik (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL,
    Haslo TEXT NOT NULL
);

-- Tabela: Kategorie
CREATE TABLE Kategorie (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Nazwa TEXT NOT NULL
);

-- Tabela: Zadania
CREATE TABLE Zadania (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Id_Uzytkownik INTEGER,
    Id_Komentarzy INTEGER,
    Id_Kategorii INTEGER,
    Id_Podzadania INTEGER,
    Tytul TEXT NOT NULL,
    Opis TEXT,
    Termin DATETIME,
    Priorytet INTEGER,
    FOREIGN KEY (Id_Uzytkownik) REFERENCES Uzytkownik(Id),
    FOREIGN KEY (Id_Komentarzy) REFERENCES Komentarze(Id),
    FOREIGN KEY (Id_Kategorii) REFERENCES Kategorie(Id),
    FOREIGN KEY (Id_Podzadania) REFERENCES Podzadania(Id)
);

-- Tabela: Podzadania
CREATE TABLE Podzadania (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Id_Zadania INTEGER,
    FOREIGN KEY (Id_Zadania) REFERENCES Zadania(Id)
);

-- Tabela: Komentarze
CREATE TABLE Komentarze (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Id_Zadania INTEGER,
    Id_Uzytkownika INTEGER,
    Opis TEXT NOT NULL,
    FOREIGN KEY (Id_Zadania) REFERENCES Zadania(Id),
    FOREIGN KEY (Id_Uzytkownika) REFERENCES Uzytkownik(Id)
);

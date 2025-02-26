CREATE TABLE voluntario (
id_voluntario SERIAL PRIMARY KEY,
cpf VARCHAR(11) UNIQUE NOT NULL,
nome VARCHAR(100) NOT NULL,
sobrenome VARCHAR(100) NOT NULL,
data_nascimento DATE NOT NULL,
endereco VARCHAR(200),
email VARCHAR(100) UNIQUE NOT NULL,
telefone VARCHAR(11) NOT NULL
);

CREATE TABLE trabalho (
id_trabalho SERIAL PRIMARY KEY,
nome_trabalho VARCHAR(100) NOT NULL,
ong_responsavel VARCHAR(100) NOT NULL,
localizacao VARCHAR(200) NOT NULL,
data_inicio DATE NOT NULL,
data_termino DATE NOT NULL
);

CREATE TABLE status (
id_status SERIAL PRIMARY KEY,
id_trabalho INT,
id_voluntario INT,
quantidade_vagas INT NOT NULL,
duracao VARCHAR(50),
status_trabalho VARCHAR(50),
FOREIGN KEY (id_trabalho) REFERENCES trabalho(id_trabalho),
FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario) 
);


SELECT * FROM voluntario;

INSERT INTO voluntario(cpf, nome, sobrenome, data_nascimento, endereco, email, telefone)
VALUES (12345678900, 'Neil Abram', 'Josten', '1987-03-31', 'Rua das Raposas, 103', 'NAJ.fox@gmail.com', 11987654321),
(12345328900, 'Andrew Joseph', 'Minyard', '1986-11-04', 'Rua das Melancias, 130', 'andrew.minyard@gmail.com', 11997654321),
(12345678765, 'Glinda', 'Butera', '2008-03-21', 'Terra de Oz, 189', 'popular123@gmail.com', 11987652222),
(11334673512, 'Elphaba', 'Erivo', '1999-03-27', 'Emerald City, 345', 'defying.gravity@gmail.com', 119876789),
(11334664759, 'Marinette', 'Dupeng', '2003-07-09', 'La vie en rose, 231', 'dupeng.cheng@gmail.com', 119871236);

INSERT INTO status(quantidade_vagas, duracao, status_trabalho)
VALUES 
(102, '3 meses', 'Em andamento'),
(26, '2 anos', 'Concluído'),
(50, '4 meses', 'Cancelado'),
(24, '5 semanas', 'Agendado'),
(12, '6 meses', 'Em andamento');

INSERT INTO trabalho (nome_trabalho, ong_responsavel, localizacao, data_inicio, data_termino) 
VALUES 
('Apoio a Crianças Carentes', 'Esperança Viva', 'São Paulo - SP', '2025-03-01', '2025-12-20'),
('Resgate Animal', 'Patas Felizes', 'Rio de Janeiro - RJ', '2025-04-15', '2025-10-30'),
('Unidade Hospitalar Móvel', 'Mãos que curam', 'Belo Horizonte -BH', '2025-03-21', '2025-11-19'),
('Saneamento Basico em Comunidades', 'H2Somos', 'Rio grande do Sul- RS', '2025-03-16', '2025-11-28'),
('Reflorestamento Urbano', 'Verde para o Futuro', 'Curitiba - PR', '2025-05-10', '2025-11-15'); 
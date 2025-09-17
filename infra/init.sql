CREATE TABLE voluntario (
id_voluntario SERIAL PRIMARY KEY,
cpf VARCHAR(11) UNIQUE NOT NULL,
nome VARCHAR(100) NOT NULL,
sobrenome VARCHAR(100) NOT NULL,
data_nascimento DATE NOT NULL,
endereco VARCHAR(200),
email VARCHAR(100) UNIQUE NOT NULL,
telefone VARCHAR(11) NOT NULL,
senha VARCHAR(100) NOT NULL
);

ALTER TABLE voluntario
ADD COLUMN imagem_perfil VARCHAR(200);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE voluntario
ADD COLUMN uuid UUID DEFAULT gen_random_uuid() NOT NULL;


CREATE TABLE trabalho (
id_trabalho SERIAL PRIMARY KEY,
nome_trabalho VARCHAR(100) NOT NULL,
ong_responsavel VARCHAR(100) NOT NULL,
localizacao VARCHAR(200) NOT NULL,
data_inicio DATE NOT NULL,
data_termino DATE NOT NULL
);

CREATE TABLE participacao (
id_participacao SERIAL PRIMARY KEY,
id_trabalho INT,
id_voluntario INT,
quantidade_vagas INT NOT NULL,
duracao VARCHAR(50),
atividade_trabalho VARCHAR(50),
FOREIGN KEY (id_trabalho) REFERENCES trabalho(id_trabalho),
FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario) 
);

-- Criar a função gerar_senha_padrao (ou substituir caso já exista)
CREATE OR REPLACE FUNCTION gerar_senha_padrao()
RETURNS TRIGGER AS $$
BEGIN
    -- Se a senha não for informada, gera a padrão
    IF NEW.senha IS NULL OR NEW.senha = '' THEN
        NEW.senha := NEW.nome || '1234';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar a trigger trigger_gerar_senha apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_gerar_senha') THEN
        CREATE TRIGGER trigger_gerar_senha
        BEFORE INSERT ON voluntario
        FOR EACH ROW
        EXECUTE FUNCTION gerar_senha_padrao();
    END IF;
END $$;


SELECT * FROM voluntario;
SELECT * FROM participacao;
SELECT * FROM trabalho;


-- alterações das tabelas no banco
ALTER TABLE voluntario ADD COLUMN status_voluntario BOOLEAN DEFAULT TRUE;
ALTER TABLE trabalho ADD COLUMN status_trabalho BOOLEAN DEFAULT TRUE;
ALTER TABLE participacao ADD COLUMN status_trabalho BOOLEAN DEFAULT TRUE;
ALTER TABLE participacao ADD COLUMN status_participacao_voluntario BOOLEAN DEFAULT TRUE;
ALTER TABLE trabalho ADD COLUMN status_trabalho_registro BOOLEAN DEFAULT TRUE;

INSERT INTO voluntario(cpf, nome, sobrenome, data_nascimento, endereco, email, telefone)
VALUES (12345678900, 'Neil Abram', 'Josten', '1987-03-31', 'Rua das Raposas, 103', 'NAJ.fox@gmail.com', 11987654321),
(12345328900, 'Andrew Joseph', 'Minyard', '1986-11-04', 'Rua das Melancias, 130', 'andrew.minyard@gmail.com', 11997654321),
(12345678765, 'Glinda', 'Butera', '2008-03-21', 'Terra de Oz, 189', 'popular123@gmail.com', 11987652222),
(11334673512, 'Elphaba', 'Erivo', '1999-03-27', 'Emerald City, 345', 'defying.gravity@gmail.com', 11987678912),
(11334664759, 'Marinette', 'Dupeng', '2003-07-09', 'La vie en rose, 231', 'dupeng.cheng@gmail.com', 11987123655);

SELECT * FROM voluntario WHERE nome IN ('Elphaba', 'Marinette');

UPDATE voluntario
SET telefone = '11987678912'
WHERE nome = 'Elphaba';

UPDATE voluntario
SET telefone = '11987123655'
WHERE nome = 'Marinette';

SELECT * FROM voluntario ORDER BY id_voluntario;


INSERT INTO trabalho (nome_trabalho, ong_responsavel, localizacao, data_inicio, data_termino) 
VALUES 
('Apoio a Crianças Carentes', 'Esperança Viva', 'São Paulo - SP', '2025-03-01', '2025-12-20'),
('Resgate Animal', 'Patas Felizes', 'Rio de Janeiro - RJ', '2025-04-15', '2025-10-30'),
('Unidade Hospitalar Móvel', 'Mãos que curam', 'Belo Horizonte -BH', '2025-03-21', '2025-11-19'),
('Saneamento Basico em Comunidades', 'H2Somos', 'Rio grande do Sul- RS', '2025-03-16', '2025-11-28'),
('Reflorestamento Urbano', 'Verde para o Futuro', 'Curitiba - PR', '2025-05-10', '2025-11-15'); 


INSERT INTO participacao(id_trabalho, id_voluntario, quantidade_vagas, duracao, atividade_trabalho)
VALUES 
(1, 15, 102, '3 meses', 'Em andamento'),  
(5, 13, 26, '2 anos', 'Concluído'),       
(4, 12, 50, '4 meses', 'Cancelado'),       
(2, 11, 24, '5 semanas', 'Agendado'),     
(3, 14, 12, '6 meses', 'Em andamento');    



-- SQL DE REQUSITO NÃO FUNCIONAL
-- Criação da tabela muralTrabalhos
CREATE TABLE muralTrabalhos (
    id_mural_trabalhos SERIAL PRIMARY KEY,
    nome_trabalho VARCHAR(100) NOT NULL,
    ong_responsavel VARCHAR(100) NOT NULL,
    total_voluntarios INTEGER CHECK (total_voluntarios >= 0),
    data_encerramento DATE
);

-- Inserção de 20 registros
INSERT INTO muralTrabalhos (nome_trabalho, ong_responsavel, total_voluntarios, data_encerramento)
VALUES 
('Mutirão da Limpeza', 'Verde Esperança', 25, '2024-05-10'),
('Apoio a Idosos', 'Cuidar é Amar', 15, '2024-06-20'),
('Campanha do Agasalho', 'Solidarize-se', 30, '2024-07-15'),
('Educação para Todos', 'Ensina Brasil', 40, '2024-08-25'),
('Doação de Alimentos', 'Mesa Cheia', 50, '2024-09-10'),
('Plantio de Árvores', 'Verde Esperança', 20, '2024-10-05'),
('Criança Feliz', 'Sorriso Solidário', 35, '2024-11-12'),
('Recicla Aí', 'Planeta Limpo', 18, '2024-12-01'),
('Saúde na Comunidade', 'Cuidar é Amar', 22, '2024-08-18'),
('Oficinas Culturais', 'Arte para Todos', 28, '2024-12-15'),
('Ação Jovem 2011', 'Juventude Ativa', 12, '2011-09-15'),
('Construindo Esperança', 'Mãos Unidas', 20, '2013-06-10'),
('Projeto Sementes', 'Verde Vivo', 18, '2014-11-22'),
('Natal Solidário', 'Anjos do Bem', 35, '2015-12-18'),
('Oficina de Talentos', 'Arte Livre', 10, '2016-04-05'),
('Saúde em Foco', 'Vida Plena', 22, '2017-08-27'),
('Luz na Infância', 'Sorriso de Criança', 30, '2019-03-12'),
('Inverno Quente', 'Acolher é Viver', 40, '2020-07-30'),
('Voluntários do Bem', 'Rede Solidária', 28, '2022-10-19'),
('Educar para Transformar', 'Mente Aberta', 50, '2024-01-25'); 


-- alterações na tabela muralTrabalhos
ALTER TABLE muralTrabalhos ADD COLUMN status_mural_trabalho BOOLEAN DEFAULT TRUE;

DROP TRIGGER IF EXISTS trigger_gerar_senha ON voluntario;
DROP FUNCTION IF EXISTS gerar_senha_padrao();

CREATE OR REPLACE FUNCTION gerar_senha_padrao()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.senha IS NULL OR NEW.senha = '' THEN
        NEW.senha := NEW.nome || '1234';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gerar_senha
BEFORE INSERT ON voluntario
FOR EACH ROW
EXECUTE FUNCTION gerar_senha_padrao();

INSERT INTO voluntario (cpf, nome, sobrenome, data_nascimento, endereco, email, telefone)
VALUES ('55544433322', 'Teste', 'Urgente', '2000-01-01', 'Rua da Lety', 'teste@urgente.com', '11999998888');

SELECT id_voluntario, nome, senha FROM voluntario WHERE nome = 'Teste';

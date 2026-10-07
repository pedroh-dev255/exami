create database exami;
use exami;

SET GLOBAL time_zone = '+00:00';
SET SESSION time_zone = '+00:00';

CREATE table db_versao(
    id INT AUTO_INCREMENT,
    versao VARCHAR(20) NOT NULL,
    descricao TEXT,
    aplicado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(id)
);

INSERT INTO db_versao (versao, descricao) VALUES ('0.0', 'Versão inicial do banco de dados');
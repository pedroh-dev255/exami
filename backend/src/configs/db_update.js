const pool = require("./database");

const migrations = {
    /* Exemplo de como adicionar uma migration:
    "0.1": [
        "ALTER TABLE chat_participantes ADD COLUMN left_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at;"
    ],
    */
};


function compareVersions(a, b) {
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);

    const length = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < length; i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;

        if (aPart > bPart) return 1;
        if (aPart < bPart) return -1;
    }
    return 0;
}


module.exports = async function db_update() {
    try {
        const [version] = await pool.query(`
            SELECT *
            FROM db_versao
            ORDER BY aplicado_em DESC
            LIMIT 1
        `);

        const currentVersion = version[0]?.versao;

        if (!currentVersion) {
            console.log("⚠️ Nenhuma versão encontrada no banco de dados.");
            throw new Error("Nenhuma versão do banco de dados encontrada.");
        }

        console.log("🟢 Banco de dados atual: ", currentVersion);

        // Pega todas as migrations posteriores à versão atual
        const pendingMigrations = Object.keys(migrations)
            .filter(version => compareVersions(version, currentVersion) > 0)
            .sort(compareVersions);

        // Nenhuma atualização pendente
        if (pendingMigrations.length === 0) {
            console.log("✅ Banco de dados já está atualizado.");
            return currentVersion;
        }

        console.log(`🔄 ${pendingMigrations.length} atualização(ões) pendente(s).`);

        let lastVersion = currentVersion;

        for (const migrationVersion of pendingMigrations) {
            console.log(`⬆️ Atualizando banco de dados: ${lastVersion} → ${migrationVersion}`);
            const queries = migrations[migrationVersion];

            try {
                // Executa todas as queries daquela migration
                for (const query of queries) {

                    console.log("   ↳ Executando:", query);

                    await pool.query(query);
                }

                // Só registra a versão depois que TODAS as queries
                // daquela migration foram executadas com sucesso
                await pool.query(
                    `
                    INSERT INTO db_versao (versao)
                    VALUES (?)
                    `,
                    [migrationVersion]
                );

                lastVersion = migrationVersion;
                console.log(`✅ Banco atualizado para ${migrationVersion}`);

            } catch (error) {
                console.error(`❌ Erro ao executar migration ${migrationVersion}`);
                throw error;
            }
        }

        console.log(
            `🟢 Banco de dados atualizado com sucesso: ${lastVersion}`
        );
        return lastVersion;


    } catch (error) {
        console.log("🔴 Erro ao Atualizar Banco de Dados");
        throw error;
    }
};
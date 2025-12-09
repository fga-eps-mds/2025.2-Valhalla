const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de resumo gerado pelo Jest
const jsonPath = path.join(__dirname, 'coverage', 'coverage-summary.json');
const csvPath = path.join(__dirname, 'coverage', 'planilha-cobertura.csv');

try {
    // Lê o arquivo JSON
    const rawData = fs.readFileSync(jsonPath);
    const coverageData = JSON.parse(rawData);

    // Cabeçalho da Planilha
    let csvContent = "Arquivo;Linhas Cobertas (%);Funções Cobertas (%);Branches (%);Status\n";

    // Loop por cada arquivo testado
    for (const [filePath, metrics] of Object.entries(coverageData)) {
        if (filePath === 'total') continue; // Pula o total geral se quiser (ou remova essa linha)

        // Pega apenas o nome do arquivo para ficar limpo (remove o caminho completo)
        const fileName = path.basename(filePath);
        
        const linesPct = metrics.lines.pct;
        const funcsPct = metrics.functions.pct;
        const branchPct = metrics.branches.pct;

        // Define um status simples
        let status = "OK";
        if (linesPct < 80) status = "ATENÇÃO";
        if (linesPct < 50) status = "CRÍTICO";

        // Adiciona a linha no CSV (usando ponto e vírgula para Excel em PT-BR)
        csvContent += `${fileName};${linesPct}%;${funcsPct}%;${branchPct}%;${status}\n`;
    }

    // Adiciona o TOTAL GERAL no final
    const total = coverageData.total;
    csvContent += `TOTAL GERAL;${total.lines.pct}%;${total.functions.pct}%;${total.branches.pct}%;-\n`;

    // Salva o arquivo
    fs.writeFileSync(csvPath, csvContent);
    console.log(`\n✅ Sucesso! Planilha gerada em: ${csvPath}`);
    console.log("👉 Você pode abrir este arquivo no LibreOffice Calc ou Excel.\n");

} catch (error) {
    console.error("Erro ao gerar planilha:", error.message);
    console.log("Dica: Rode 'npm run test' antes de rodar este script.");
}
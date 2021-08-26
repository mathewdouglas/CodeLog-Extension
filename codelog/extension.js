const vscode = require('vscode');
const axios = require('axios');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	var result = await axios.get("https://mathewdouglas.co.za/CodeLog/data.json");
	var json = result.data.snippets;
	var languages = [json.length - 1];

	for (let i = 1; i < json.length; i++) {
		const element = json[i];
		languages[i-1] = {
			"label": element[0].language,
			"data": element.map(item => {
				return {
					label: item.title,
					detail: item.content,
				}
			}),
		};

	}

	// console.log(result.data);

	vscode.window.showInformationMessage('CodeLog Snippets is up and running');

	let disposable = vscode.commands.registerCommand(
		'codelog.getSnippet',
		async function () {
			const snippet = await vscode.window.showQuickPick(languages, {
				matchOnDetail: true
			})
			console.log(snippet);

			if (snippet == null) return

			const item = await vscode.window.showQuickPick(snippet.data, {
				matchOnDetail: true
			})
			console.log(item);
		}
	);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

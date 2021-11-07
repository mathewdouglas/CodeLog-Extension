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
					code: item.code,
				}
			}),
		};

	}

	// console.log(result.data);

	vscode.window.showInformationMessage('CodeLog Snippets is up and running');

	let disposable = vscode.commands.registerCommand(
		'codelog.getSnippet',
		async function () {
			// Shows the quick picker prompting the user to pick a language
			const language = await vscode.window.showQuickPick(languages, {
				matchOnDetail: true
			})
			console.log(language);

			// Checks if there was an issue with picking a language and returns
			if (language == null) return;

			// Shows the quick picker prompting the user to pick a snippet
			const snippet = await vscode.window.showQuickPick(language.data, {
				matchOnDetail: true
			})
			console.log(snippet);
			
			// Gets the active editor to get the user's current text selection
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage("Editor does not exist");
				return;
			}

			// Edits the current text selection to match the user's choice of snippet
			editor.edit(edit => {
				edit.replace(editor.selection, snippet.code)
			})
		}
	);

	let refresh = vscode.commands.registerCommand(
		'codelog.refresh',
		async function () {
			result = await axios.get("https://mathewdouglas.co.za/CodeLog/data.json");
			json = result.data.snippets;
			languages = [json.length - 1];

			for (let i = 1; i < json.length; i++) {
				const element = json[i];
				languages[i-1] = {
					"label": element[0].language,
					"data": element.map(item => {
						return {
							label: item.title,
							detail: item.content,
							code: item.code,
						}
					}),
				};
		
			}

			vscode.window.showInformationMessage("Refreshed");
		}
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(refresh);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

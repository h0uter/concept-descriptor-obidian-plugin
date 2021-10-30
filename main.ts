import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.registerInterval(window.setInterval(() => this.matchSubstrings(), 0.2 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	matchSubstrings() {
		let content = this.getCurrentLineContent()
		const regexConcept = /(?<=(-\s))[A-Z].{1,}(?<=::)/;
		const regexDescriptor = /(?<=(-\s))[a-z].{1,}(?<=::)/;

		const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		const doc = editor.getDoc()
		const curLineNum = doc.getCursor().line
		let match
		let modified_line
		
		switch (content) {
			case content.match(regexConcept)?.input:
				console.log("matched a concept")
				new Notice("matched a Concept");

				match = regexConcept.exec(content)
				modified_line = content.replace(regexConcept, '**' + match[0] + '**')
				break
				
			case content.match(regexDescriptor)?.input:
				console.log("matched a descriptor")
				new Notice("matched a descriptor");
				
				match = regexDescriptor.exec(content)
				modified_line = content.replace(regexDescriptor, '*' + match[0] + '*')
				break
		}

		doc.setLine(curLineNum, modified_line)
		}


	getCurrentLineContent() {
		const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		const doc = editor.getDoc()
		const curLineNum = doc.getCursor().line

		const lineContent = doc.getLine(curLineNum).trim()
		return lineContent
	}
}
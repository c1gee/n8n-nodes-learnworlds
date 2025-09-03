module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['plugin:n8n-nodes-base/nodes'],
	rules: {
		'n8n-nodes-base/node-param-default-missing': 'off',
		'n8n-nodes-base/node-param-description-empty': 'off',
	},
}; 
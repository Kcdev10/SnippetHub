import prettier from 'prettier';

const detectParser = (code: string): string => {
  // Simple heuristics to determine the type of code
  if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
    return 'json';
  }

  if (
    code.includes('const') ||
    code.includes('let') ||
    code.includes('function')
  ) {
    // Basic check for JavaScript/TypeScript
    if (
      code.includes('interface') ||
      code.includes('type') ||
      code.includes('import')
    ) {
      return 'typescript';
    }
    return 'babel'; // Default to JavaScript
  }
  if (code.includes('<') && code.includes('>')) {
    return 'html';
  }
  if (
    code.includes('body {') ||
    code.includes('.class {') ||
    code.includes('color:')
  ) {
    return 'css';
  }
  // Default to JavaScript if undetermined
  return 'babel';
};

export const formatCode = async (code: string): Promise<string> => {
  try {
    const parser = detectParser(code);
    return prettier.format(code, {
      parser: parser,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
      printWidth: 80,
    });
  } catch (error) {
    console.error('Error formatting code:', error);
    return code; // Return unformatted code in case of an error
  }
};

interface NodeObject {}
interface TokenObject {}
interface IdentifierObject {}
interface SourceFileObject {}

type TypeScriptTreeNode = NodeObject | TokenObject | IdentifierObject | SourceFileObject | any

type TypeScriptLibrary = {
  SyntaxKind: {
    [key: string]: any
  }
}

export default class ASTQAdapterTypeScript {
  constructor(private typescript: TypeScriptLibrary) {}

  taste(node: TypeScriptTreeNode): boolean {
    return typeof node === 'object' && node !== null && typeof node.kind === 'number'
  }
  getParentNode(node: TypeScriptTreeNode, type: string): TypeScriptTreeNode {
    return node.parent
  }
  getChildNodes(node: TypeScriptTreeNode, type: string): TypeScriptTreeNode[] {
    return this.taste(node) ? node.getChildren() : []
  }
  getNodeType(node: TypeScriptTreeNode): string {
    return this.typescript.SyntaxKind[node.kind]
  }

  // This exists in examples but isn't actually used by astq currently so tests don't cover it
  // getNodeAttrNames(node: TypeScriptTreeNode): string[] {
  //   return node
  //     .getOwnPropertyNames()
  //     .filter((propertyName: string) => isValidAttributeForNode(node, propertyName))
  // }

  getNodeAttrValue(node: TypeScriptTreeNode, attr: string): string {
    return isValidAttributeForNode(node, attr) ? node[attr] : undefined
  }
}

function isValidAttributeForNode(node: TypeScriptTreeNode, attr: string): boolean {
  return node.hasOwnProperty(attr) && typeof node[attr] !== 'object'
}

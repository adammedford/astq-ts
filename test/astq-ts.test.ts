import ASTQAdapterTypeScript from '../src/astq-ts'
import * as typescript from 'typescript'

import * as astq from 'astq'

/**
 * ASTQAdapterTypeScript test
 */
describe('ASTQAdapterTypeScript test', () => {
  let adapter: ASTQAdapterTypeScript
  let queryEngine: astq
  let sampleAST: any
  let results: any[]

  it('ASTQAdapterTypeScript is instantiable', () => {
    adapter = new ASTQAdapterTypeScript(typescript)
    expect(adapter).toBeInstanceOf(ASTQAdapterTypeScript)
  })

  it('astq Query Engine is instantiable', () => {
    queryEngine = new astq()
    expect(queryEngine).toBeInstanceOf(astq)
  })

  it('astq Query Engine accepts the adapter', () => {
    queryEngine.adapter(adapter)
  })

  it('sample data should be parsed from source', () => {
    sampleAST = createSourceFile(source)
    expect(sampleAST).toBeTruthy()
  })

  it('querying sample should return array of results', () => {
    results = queryEngine.query(sampleAST, query)
    expect(results).toBeTruthy()
    expect(results.length).toEqual(2)
  })

  it('first result should match', () => {
    testResult(results[0], 'bar', 'quux')
    testResult(results[1], 'baz', '42')
  })

  it('should cover all the tests', () => {
    testQuery('// * [ @"escapedText" ]').toBeTruthy()
    testQuery('// * [ below({node}) ]', { node: sampleAST }).toBeTruthy()
    testQuery('-// *').toBeTruthy()
    testQuery('+// *').toBeTruthy()
    testQuery('* / * ! [ count(/ * ! / *) == 3 ]').toBeTruthy()
    testQuery("// * [ @foo == 'bar' && +// * [ @quux == 'baz' ] ]").toBeTruthy()
    testQuery("// * [ @foo == 'bar' ] +// * [ @quux == 'baz' ]").toBeTruthy()
    testQuery("// * [ @foo == 'bar' ]").toBeTruthy()
  })

  function testQuery(query, queryOptions?) {
    const result = queryEngine.query(sampleAST, query, queryOptions)
    return expect(result)
  }

  function testResult(result: any, variableName: string, value: any) {
    expect(result.name.escapedText).toEqual(variableName)
    expect(result.initializer.text).toEqual(value)
  }
})

function createSourceFile(sourceText: string) {
  return typescript.createSourceFile('test.js', sourceText, typescript.ScriptTarget.Latest, true)
}

const source = `
    class Foo {
        foo () {
            const bar = "quux"
            let baz = 42
        }
    }
`

const query = `
// VariableDeclaration [
  /:name   Identifier [ @escapedText ]
  &&
  (/:initializer StringLiteral [ @text ] || /:initializer * [ @text ])
]

`

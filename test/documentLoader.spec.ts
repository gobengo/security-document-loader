import { expect } from 'chai'
import { httpClientHandler, securityLoader } from '../src';

describe('documentLoader', () => {
  it('should load a document', async () => {
    expect(httpClientHandler.get).to.exist

    const contextObject = {}
    const loader = securityLoader()
    loader.addStatic('https://example.com/my-context/v1', contextObject)

    const documentLoader = loader.build()

    const result = await documentLoader('https://example.com/my-context/v1')
    expect(result.document).to.equal(contextObject)
  })

  it('should load a status VC from web', async () => {
    const documentLoader = securityLoader({fetchRemoteContexts: true}).build();

    const url = 'https://digitalcredentials.github.io/credential-status-playground/JWZM3H8WKU';
    const result = await documentLoader(url);
    expect(result.document.issuer).to
      .equal('did:key:z6MkhVTX9BF3NGYX6cc7jWpbNnR7cAjH8LUffabZP8Qu4ysC');
  });

  it('supports beta OBv3 context', async () => {
    const load = securityLoader().build()
    const { document } = await load('https://purl.imsglobal.org/spec/ob/v3p0/context.json')
    expect(document['@context'].OpenBadgeCredential['@id'])
      .to.equal('https://purl.imsglobal.org/spec/vc/ob/vocab.html#OpenBadgeCredential')

    const legacyLoad = securityLoader({useOBv3BetaContext: true}).build()
    const { document: legacyDocument } = await legacyLoad('https://purl.imsglobal.org/spec/ob/v3p0/context.json')
    expect(legacyDocument['@context'].OpenBadgeCredential['@id'])
      .to.equal('https://imsglobal.github.io/openbadges-specification/ob_v3p0.html#OpenBadgeCredential')
  })
})

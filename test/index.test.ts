import {expect, test} from '@oclif/test';

import * as find from '../src/find';
import * as sinon from 'sinon';

import cmd = require('../src')

describe('blc', () => {
  test
  .stub(find, 'findModules', sinon.stub().resolves({}))
  .stdout()
  .do(() => cmd.run([]))
  .it('prints a message if no modules are found', ctx => {
    const findModules = find.findModules as sinon.SinonSpy;

    expect(ctx.stdout).to.contain('No modules found');
    expect(findModules.called).to.equal(true);
  });

  test
  .stub(find, 'findModules', sinon.stub().resolves({}))
  .stdout()
  .do(() => cmd.run([]))
  .it('uses current working dir as default starting location', () => {
    const findModules = find.findModules as sinon.SinonSpy;
    const {start} = findModules.args[0][0];

    expect(start).to.equal(process.cwd());
  });

  test
  .stub(find, 'findModules', sinon.stub().resolves({}))
  .stdout()
  .do(() => cmd.run(['/start/at']))
  .it('starting location can be customized', () => {
    const findModules = find.findModules as sinon.SinonSpy;
    const {start} = findModules.args[0][0];

    expect(start).to.equal('/start/at');
  });

  test
  .stub(find, 'findModules', sinon.stub().resolves({}))
  .stdout()
  .do(() => cmd.run([]))
  .it('finds all modules by default', () => {
    const findModules = find.findModules as sinon.SinonSpy;
    const {production} = findModules.args[0][0];

    expect(production).to.be.undefined;
  });

  test
  .stub(find, 'findModules', sinon.stub().resolves({}))
  .stdout()
  .do(() => cmd.run(['--production']))
  .it('finds only production modules', () => {
    const findModules = find.findModules as sinon.SinonSpy;
    const {production} = findModules.args[0][0];

    expect(production).to.be.true;
  });
});

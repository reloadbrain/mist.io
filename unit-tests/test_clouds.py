"""Tests Cloud models and Controllers"""

import os
import uuid
import json

import yaml
from deepdiff import DeepDiff
from pprint import pprint

import pytest

from mist.core.user.models import Organization, User

import mist.io.clouds.models as models

from mist.core.methods import set_machine_tags
from mist.io.methods import create_machine, destroy_machine
from mist.core.keypair.models import Keypair


TEST_DIR = os.path.dirname(os.path.abspath(__file__))


def load_clouds_from_config():
    """Load clouds configuration from unit-tests/clouds.yaml

    The YAML configuration file of clouds is expected to be in the following
    format:

        - name: My Amazon Cloud
          provider: ec2
          apikey: REDACTED
          apisecret: REDACTED
          region: ap-northeast-1
        - provider: linode
          apikey: REDACTED

    The `name` key is optional and will take the same value as `provider` if
    left blank or missing.

    """

    path = os.path.join(os.path.dirname(os.path.realpath(__file__)),
                        'clouds.yaml')
    print "Loading clouds from %s." % path
    with open(path) as fobj:
        clouds = yaml.load(fobj)
    if not isinstance(clouds, list):
        raise TypeError("Configuration in '%s' is expected to be a list, "
                        "not %s." % path, type(settings))
    for cdict in clouds:
        if not isinstance(cdict, dict):
            raise TypeError("Cloud configuration is not a dict: %r" % cdict)
        provider = cdict.get('provider')
        if not provider:
            raise ValueError("Cloud configuration doesn't specify "
                             "`provider`: %s" % cdict)
        if provider not in models.CLOUDS:
            raise KeyError("Invalid provider '%s', must be in %s." %
                           (provider, models.CLOUDS.keys()))
        if 'name' not in cdict:
            cdict['name'] = provider
        if 'fields' not in cdict:
            cdict['fields'] = {}
        if 'create_machine_params' not in cdict:
            cdict['create_machine_params'] = {}
    print "Loaded %d clouds." % len(clouds)
    return clouds


CLOUDS = load_clouds_from_config()
CLOUDS_CREATE_MACHINE = [cdict['create_machine_params']
                         for cdict in CLOUDS]
CLOUD_NAMES = [cdict['name'] for cdict in CLOUDS]


@pytest.fixture(scope='module')
def org(request):
    """Fixture to create an organization with proper clean up"""

    name = uuid.uuid4().hex
    print "Creating org '%s'." % name
    user = User(email='%s@example.com' % name)
    user.save()
    org = Organization(name=name)
    org.add_member_to_team('Owners', user)
    org.save()

    def fin():
        """Finalizer to clean up organization after tests"""
        while org.members:
            user = org.members[0]
            print "Deleting user '%s'." % user
            org.remove_member_from_members(user)
            user.delete()
        print "Deleting org '%s'." % name
        org.delete()

    request.addfinalizer(fin)

    return org


@pytest.fixture(scope='module')
def key(request, org):
    """Fixture to create an SSH Keypair with proper cleanup"""

    key = Keypair()
    key.generate()
    name = uuid.uuid4().hex
    print "Creating key '%s'." % name
    key = Keypair(name=name, public=key.public, private=key.private, owner=org)
    key.save()

    def fin():
        """Finalizer to clean up organization after tests"""
        print "Deleting key '%s'." % name
        key.delete()

    request.addfinalizer(fin)

    return key


@pytest.fixture(scope='module', params=CLOUDS, ids=CLOUD_NAMES)
def cloud(request, org):
    """Fixture to create clouds from config file with proper cleanup"""

    cdict = request.param
    name = cdict['name']
    cls = models.CLOUDS[cdict['provider']]
    print "Creating cloud '%s'." % name
    cloud = cls.add(org, name, **cdict['fields'])

    def fin():
        """Finalizer clean up cloud after tests"""
        print "Deleting cloud '%s'." % name
        cloud.delete()

    request.addfinalizer(fin)

    return cloud


@pytest.fixture
def load_staging_l_machines():
    path = os.path.join(TEST_DIR, 'list_machines.json')
    print "Reading machines from path '%s'." % path
    with open(path) as fobj:
        return json.load(fobj)


@pytest.fixture
def load_staging_l_locations():
    path = os.path.join(TEST_DIR, 'list_locations.json')
    print "Reading locations from path '%s'." % path
    with open(path) as fobj:
        return json.load(fobj)


@pytest.fixture
def load_staging_l_sizes():
    path = os.path.join(TEST_DIR, 'list_sizes.json')
    print "Reading sizes from path '%s'." % path
    with open(path) as fobj:
        return json.load(fobj)


@pytest.fixture
def load_staging_l_images():
    path = os.path.join(TEST_DIR, 'list_images.json')
    print "Reading images from path '%s'." % path
    with open(path) as fobj:
        return json.load(fobj)



@pytest.fixture(scope='module', params=CLOUDS_CREATE_MACHINE)#, ids=CLOUD_NAMES)
def machine(request,org, cloud, key):
    cdict = request.param
    job_id = uuid.uuid4().hex
    cloud_id = cloud.id
    key_id = key.id
    machine_name = 'kalokalokairi'

    tags = {'dwse': 'dokimi'}

    print "Create machine"
    machine = create_machine(user=org, cloud_id=cloud_id, key_id=key_id,
                              machine_name=machine_name, ips=None,
                              monitoring=False, ssh_port=22, job_id=job_id,
                             **cdict)
    def fin():
        print ("destroy machine machine")
        destroy_machine(org, cloud.id, machine['id'])

    request.addfinalizer(fin)

    return machine


def unicode_to_str(data):
    if isinstance(data, dict):
        return {unicode_to_str(key): unicode_to_str(value)
                for key, value in data.iteritems()}
    elif isinstance(data, list):
        return [unicode_to_str(element) for element in data]
    elif isinstance(data, unicode):
        return data.encode('utf-8')
    else:
        return data


def diff(a, b, **kwargs):
    """Return a recursive diff of two objects after casting unicodes to str"""
    return DeepDiff(unicode_to_str(a), unicode_to_str(b), **kwargs)


def compare_fields(res):
    """Compare deep diff of objects, type of fields and values that changed"""
    pprint(res, indent=2)
    changes = res.get('type_changes')
    if changes:
        for key in changes:
            assert changes[key]['new_type'] == changes[key]['old_type']

    values_changed = res.get('values_changed')
    if values_changed:
        for k, v in values_changed.iteritems():
            if isinstance(v['new_value'], bool):
                assert v['new_value'] == v[
                    'old_value'], "new_value %s changed " \
                                  "to %s" % (k, v['new_value'])


def test_list_machines(cloud, load_staging_l_machines):

    response = cloud.ctl.list_machines()
    print len(response)

    if response:
        machine = response[0]
        ref = load_staging_l_machines.get(cloud.ctl.provider)
        for t in machine, ref:
            # Remove keys from extra.
            for key in ('billingItemChildren', 'hoursUsed', 'recurringFee'):
                if key in t['extra']:
                    t['extra'].pop(key)

        # Ignore value changes in some fields.
        for key in ('uuid', 'last_seen'):
            if type(machine[key]) == type(ref[key]) or (
                isinstance(machine[key], basestring) and
                isinstance(ref[key], basestring)
            ):
                machine[key] = ref[key]

        res = diff(ref, machine)
        compare_fields(res)


def test_list_locations(cloud, load_staging_l_locations):

    response = cloud.ctl.list_locations()
    print len(response)

    if response:
        ref = load_staging_l_locations.get(cloud.ctl.provider)
        res = diff(ref, response, ignore_order=True)
        compare_fields(res)


def test_list_images(cloud, load_staging_l_images):

    response = cloud.ctl.list_images()
    print len(response)

    if response:
        ref = load_staging_l_images.get(cloud.ctl.provider)
        res = diff(ref, response, ignore_order=True)
        compare_fields(res)


def test_list_sizes(cloud, load_staging_l_sizes):

    response = cloud.ctl.list_sizes()
    print len(response)

    if response:
        ref = load_staging_l_sizes.get(cloud.ctl.provider)
        res = diff(ref, response, ignore_order=True)
        compare_fields(res)


def test_create_machine_list_machines(cloud, machine):

    machines = cloud.ctl.list_machines()
    print len(machines)

    for m in machines:
        if m['name'] == machine['name']:
            print "success"
            # for key, value in machine.iteritems():
            #     if key=='tags':
            #         assert value==tags



include('util.js');

const TYPE_CLONE_DEPTH = 3;

/* copied from xpcom/analysis/static-checking.js */
function hasAttribute(c, attrname)
{
  var attr;

  if (c.attributes === undefined)
    return false;

  for each (attr in c.attributes)
    if (attr.name == 'user' && attr.value[0] == attrname)
      return true;

  return false;
}

/*
 * because structurally_equal() sometimes causes stack-overflow,
 * we partially copy type descriptors before comparison.
 * this is OK because our partial copy contains its type name,
 * that what we want to compare with.
 */
function shallow_clone(myObj, depth)
{
  if(typeof(myObj) != 'object') return myObj;
  if(0 == depth) return {};
  if(myObj.constructor == Array) {
    return myObj.map(function(item) { return shallow_clone(item, depth-1); })
  }
  var myNewObj = new myObj.constructor();

  for(var i in myObj)
    myNewObj[i] = shallow_clone(myObj[i], depth-1);

  return myNewObj;
}

function unqualifiedName(method)
{
  var qname = method.name;
  var end = qname.indexOf('(');
  var beg = qname.substring(0, end).lastIndexOf("::") + 2;
  return qname.substring(beg, end);
}

function overridingMethodOf(klass, m)
{

  for (let i=0; i<klass.members.length; ++i) {
    var n = klass.members[i];
    if (n.isFunction && n.isVirtual &&
	unqualifiedName(m) == unqualifiedName(n) && 
	structurally_equal(shallow_clone(m.type, TYPE_CLONE_DEPTH),
			   shallow_clone(n.type, TYPE_CLONE_DEPTH))) {
      return n;
    }
  }
  
  if (!klass.bases) {
    return null;
  }

  for (let i=0; i<klass.bases.length; ++i) {
    let base = klass.bases[i].type;
    let n = overridingMethodOf(base, m);
    if (n) {
      return n;
    }
  }

  return false;
}

function overriding(klass, method)
{
  if (!klass.bases) {
    return null;
  }

  for (let i=0; i<klass.bases.length; ++i) {
    let base = klass.bases[i].type;
    let n = overridingMethodOf(base, method);
    if (n) {
      return n;
    }
  }

  return null;
}

function process_type(c)
{
  for (let i=0; i<c.members.length; ++i) {
    var m = c.members[i];
    if (m.isFunction && hasAttribute(m, "MY_override")) {
      let n = overriding(c, m);
      if (n) {
	print("OK:" + m.name + " ovrrides " + n.name);
      } else {
	print("NG:" + m.name + " violates overriding constraint!");
      }
    }
  }

}

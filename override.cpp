
#define MY_OVERRIDE __attribute__ ((user("MY_override")))

class Base {
public:
	void neverOverride() {}
	virtual void shouldOverride() {}
	virtual void shouldOverrideByGrandBaby(int) {}
};

class Derived : public Base {
public:
	// OK.
	virtual void shouldOverride() MY_OVERRIDE {}
	// (failed to) override non-exising method
	virtual void badOverride() MY_OVERRIDE {}
	// (failed to) override method with incompatible type
	virtual void mistakenlyOverride(int ) MY_OVERRIDE {}
	// (failed to) override non-virtual method
	virtual void neverOverride() MY_OVERRIDE {}
	// no problem. MY_OVERRIDE is not specified.
	virtual void notOverride() {}
};

class Grandbaby : public Derived {
	// OK. override gran-pa method
	virtual void shouldOverrideByGrandBaby(int) MY_OVERRIDE {}
};

int main() { return 0; }

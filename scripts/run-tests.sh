#!/bin/bash

# Comprehensive test suite execution script
# Run all tests and generate coverage reports

set -e

echo "========================================="
echo "Prompt Improver - Test Suite"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Parse command line arguments
TEST_TYPE=${1:-all}
VERBOSE=${2:-false}

case $TEST_TYPE in
    all)
        print_status "Running all tests..."
        npm run test:all
        ;;
    unit)
        print_status "Running unit tests..."
        npm run test:unit
        ;;
    e2e)
        print_status "Running E2E tests..."
        npm run test:e2e
        ;;
    accessibility)
        print_status "Running accessibility tests..."
        npm run test:accessibility
        ;;
    performance)
        print_status "Running performance tests..."
        npm run test:performance
        ;;
    security)
        print_status "Running security tests..."
        npm run test:security
        ;;
    coverage)
        print_status "Running tests with coverage..."
        npm run test:unit
        ;;
    *)
        print_error "Unknown test type: $TEST_TYPE"
        echo ""
        echo "Usage: $0 [test-type]"
        echo ""
        echo "Test types:"
        echo "  all           - Run all tests (default)"
        echo "  unit          - Run unit tests only"
        echo "  e2e           - Run E2E tests only"
        echo "  accessibility - Run accessibility tests only"
        echo "  performance   - Run performance tests only"
        echo "  security      - Run security tests only"
        echo "  coverage      - Run tests with coverage report"
        exit 1
        ;;
esac

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    print_status "✓ Tests completed successfully!"
    echo ""
    echo "View reports:"
    echo "  - HTML Report: npm run report"
    echo "  - Coverage: open coverage/index.html"
else
    echo ""
    print_error "✗ Tests failed!"
    echo ""
    echo "Check the logs above for details."
    exit 1
fi

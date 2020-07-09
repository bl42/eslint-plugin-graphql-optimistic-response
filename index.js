module.exports = {
  rules: {
    'require-optimistic-response': {
      create: function (context) {
        let foundOptimisticResponse, activeNode;
        return {
          'ArrayPattern Identifier'(node) {
            const scope = context.getScope();
            if (
              node.parent.parent.init &&
              node.parent.parent.init.callee &&
              node.parent.parent.init.callee.name === 'useMutation'
            ) {
              scope.variables &&
                scope.variables.forEach((variable) => {
                  variable.references &&
                    variable.references.forEach((ref) => {
                      if (ref.identifier.parent.type === 'CallExpression') {
                        activeNode = ref.identifier.parent;
                        ref.identifier.parent.arguments[0] &&
                          ref.identifier.parent.arguments[0].properties &&
                          ref.identifier.parent.arguments[0].properties.forEach((prop) => {
                            if (prop.key.name === 'optimisticResponse') foundOptimisticResponse = true;
                          });
                      }
                    });
                });
              if (!foundOptimisticResponse)
                context.report(
                  activeNode || node,
                  "Optimistic is missing! Include the 'optimisticResponse' option when working with mutations."
                );
            }
          },
        };
      },
    },
  },
};

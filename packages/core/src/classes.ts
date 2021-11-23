import { FormKitNode } from './node'

/**
 * Definition for a function that produces CSS classes
 * @public
 */
export interface FormKitClasses {
  (node: FormKitNode, compositionKey: string): string | Record<string, boolean>
}

/**
 * Function that produces a standardized object representation of CSS classes
 * @param propertyKey - composition key
 * @param node - FormKit node
 * @param compositionClassList - Things to turn into classes
 * @returns
 * @public
 */
export function createClasses(
  propertyKey: string,
  node: FormKitNode,
  compositionClassList?: FormKitClasses | string | Record<string, boolean>
): Record<string, boolean> {
  if (!compositionClassList) return {}
  if (typeof compositionClassList === 'string') {
    const classKeys = compositionClassList.split(' ')
    return classKeys.reduce(
      (obj, key) => Object.assign(obj, { [key]: true }),
      {}
    )
  } else if (typeof compositionClassList === 'function') {
    return createClasses(
      propertyKey,
      node,
      compositionClassList(node, propertyKey)
    )
  }
  return compositionClassList
}

/**
 * Combines multiple class lists into a single list
 * @param node - the FormKit node being operated on
 * @param property - The property key to which the class list will be applied
 * @param args - CSS class list(s)
 * @returns
 * @public
 */
export function generateClassList(
  node: FormKitNode,
  property: string,
  ...args: Record<string, boolean>[]
): string | null {
  let combinedClassList:Record<string, boolean> = {}
  if (args && args.length) {
    combinedClassList = args.reduce((finalClassList, currentClassList) => {
      const { $reset, ...classList } = currentClassList
      if ($reset) {
        return classList
      }
      return Object.assign(finalClassList, classList)
    }, {})
  }

  return (
    Object.keys(
      node.hook.classes.dispatch({ property, classes: combinedClassList })
        .classes
    )
      .filter((key) => combinedClassList[key])
      .join(' ') || null
  )
}

using System;
using System.IO;
using System.Linq;
using System.Reflection;

var dll = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".nuget", "packages", "microsoft.openapi", "2.4.1", "lib", "net8.0", "Microsoft.OpenApi.dll");
var asm = Assembly.LoadFrom(dll);
var type = asm.GetType("Microsoft.OpenApi.OpenApiReferenceWithDescription");
foreach (var p in type.GetProperties(BindingFlags.Public | BindingFlags.Instance).OrderBy(p=>p.Name))
    Console.WriteLine(p.PropertyType.FullName + " " + p.Name);
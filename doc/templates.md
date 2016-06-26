Templates
=========

* [Letter](#letter)
* [Invoice](#invoice)
* [Report](#report)
* [Slide deck](#slide-deck)


## Letter

The "Letter" template helps you write (formal) letters, usually to print and
send my mail.

### YAML Front-Matter

```yaml
---
date:
location:
addressFrom:
  name:
  street:
  zipCode:
  city:
addressTo:
  name:
  street:
  zipCode:
  city:
signature:
---
```

## Invoice

The "Invoice" template helps you write invoices.

### YAML Front-Matter

```yaml
---
reference:
date:
amount:
companyAddress:
  name:
  street:
  zipCode:
  city:
  country:
  businessID:
customerAddress:
  name:
  street:
  zipCode:
  city:
  country:
  businessID:
---
```

## Report

The "Report" template helps you write reports.

### YAML Front-Matter

```yaml
---
company:
  name:
  logo_url:
project:
reporter:
date:
location:
reference:
version:
---
```

## Slide deck

The "Slide deck" template helps you write awesome
[Reveal.js](https://github.com/hakimel/reveal.js)-based slides. In your Markdown
content, use a separator `---` to split your content into different slides.

### YAML Front-Matter

```
---
transition: zoom # None, Fade, Slide, Convex, Concave, Zoom
---
```

---
Back to: [Writing Monod documents](writing.md)

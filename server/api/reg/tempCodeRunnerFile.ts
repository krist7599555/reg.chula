const pdf_buffer = ouid
        ? await ctx[REG_AXIOS].get(
            "/servlet/com.dtm.chula.general.servlet.CR60FileServlet?FormsButton0=Print+All+Grade+Report&studentCode=" +
              ouid
          ).then(res => res.data)
        : fs.readFileSync(__dirname + "/5846041534.pdf");

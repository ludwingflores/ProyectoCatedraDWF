package com.ucacfc.connect.controller;

import com.ucacfc.connect.service.CateringService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CateringController.class)
public class CateringControllerTest {
    
        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private CateringService cateringService;

        @Test
        @SuppressWarnings("null")
        public void testCreateCatering_InvalidInput() throws Exception {
            String invalidCateringJson = "{}";

            mockMvc.perform(post("/api/caterings")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(invalidCateringJson))
                    .andExpect(status().isBadRequest());
        }
}

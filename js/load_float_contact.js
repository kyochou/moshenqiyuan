// 动态加载浮动联系方式组件
(function() {
    // 确保在DOM准备好后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFloatContact);
    } else {
        loadFloatContact();
    }

    function loadFloatContact() {
        // 检查是否已经加载过 float_contact
        if (document.getElementById('float_contact')) {
            return;
        }

    // 获取当前页面的路径深度来确定正确的相对路径
    const currentPath = window.location.pathname;
    let relativePath = '';

    // 计算相对路径
    if (currentPath.includes('/content/')) {
        relativePath = '../';
    } else if (currentPath.includes('/tools/')) {
        relativePath = '../';
    } else {
        relativePath = '';
    }

    // 创建 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();

    // 异步加载 float_contact.html
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // 根据当前路径修正图片路径
                let pathPrefix = '';
                if (currentPath.includes('/content/')) {
                    pathPrefix = '../';
                } else if (currentPath.includes('/tools/')) {
                    pathPrefix = '../';
                } else {
                    pathPrefix = '';
                }

                // 获取响应HTML内容
                let htmlContent = xhr.responseText;
                if (pathPrefix) {
                    htmlContent = htmlContent.replace(/\.\.\/pc\//g, pathPrefix + 'pc/');
                    htmlContent = htmlContent.replace(/\.\.\/statics\//g, pathPrefix + 'statics/');
                }

                // 先插入HTML内容（不包括script）
                const tempWrapper = document.createElement('div');
                tempWrapper.innerHTML = htmlContent;

                // 查找所有script标签并提取它们
                const scripts = [];
                const scriptElements = tempWrapper.querySelectorAll('script');
                scriptElements.forEach(scriptEl => {
                    scripts.push({
                        src: scriptEl.src,
                        content: scriptEl.textContent
                    });
                    scriptEl.remove(); // 从HTML中移除script标签
                });

                // 将处理后的HTML内容插入到body中
                while (tempWrapper.firstChild) {
                    document.body.appendChild(tempWrapper.firstChild);
                }

                // 确保浮动组件的样式优先级
                const floatContact = document.getElementById('float_contact');
                if (floatContact) {
                    floatContact.style.cssText = `
                        position: fixed !important;
                        z-index: 999999 !important;
                        right: 0 !important;
                        top: auto !important;
                        bottom: 30px !important;
                    `;
                }

                // 执行提取的脚本
                setTimeout(function() {
                    console.log('Executing scripts:', scripts.length);
                    scripts.forEach(function(script, index) {
                        if (script.src) {
                            // 如果有src，直接创建新的script标签
                            const newScript = document.createElement('script');
                            newScript.src = script.src;
                            document.head.appendChild(newScript);
                            console.log('External script loaded:', script.src);
                        } else if (script.content) {
                            // 如果是内联脚本，直接添加到body中执行
                            try {
                                console.log('Executing script', index, 'length:', script.content.length);

                                const newScript = document.createElement('script');
                                newScript.textContent = script.content;
                                document.body.appendChild(newScript);

                                // 验证关键函数是否已定义
                                setTimeout(function() {
                                    console.log('rm_hidden function exists:', typeof window.rm_hidden);
                                    console.log('rm_show function exists:', typeof window.rm_show);
                                }, 50);

                            } catch (e) {
                                console.error('Error executing float_contact script:', e);
                            }
                        }
                    });
                }, 100); // 延迟100ms确保DOM完全准备好
            }
        }
    };

        // 发送请求
        xhr.open('GET', relativePath + 'components/float_contact.html', true);
        xhr.send();
    }
})();